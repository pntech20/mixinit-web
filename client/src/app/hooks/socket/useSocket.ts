import { socket } from 'app/contexts/WebsocketContext';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { AUDIO, MP3_FILE, MP4_FILE } from 'app/constants';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from 'app/helpers/local-storage';
import { useSubscriptionsSlice } from 'app/pages/Subscriptions/slice';
import { actionsTrackDetail } from 'app/pages/TracksDetail/slice';
import { actionsWishlists } from 'app/pages/Wishlist/slice';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSlack } from 'app/apis/track';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { SLACK_CHANNELS } from 'app/constants/enum';
import { convertObjectToArray } from 'utils/shared';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useLocation } from 'react-router-dom';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { actions: actionsSubscriptions } = useSubscriptionsSlice();
  const { actions: actionsTrack } = useTrackSlice();
  const { userDetail } = useSelector(selectAuth);
  const location = useLocation();
  const [code, setCode] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    if (code) {
      setCode(code);
    }
  }, [location]);

  const options = useMemo(() => {
    return {
      success: async () => {
        const trackId = getLocalStorage('trackId');
        dispatch(
          actionsTrack.updateNumberDownloadTrackRequest({
            trackId,
          }),
        );
        toastSuccess('Success! Files saved to your Dropbox.');
        sendSlack({
          text: '✅ Track save to Dropbox succeses',
          block: '✅ Track save to Dropbox succeses',
          channelId: SLACK_CHANNELS.DOWNLOADS,
          attachments: [`Track ID: ${trackId}`, `User ID: ${userDetail?._id}`],
        });
        removeLocalStorage('trackId');
        dispatch(
          actionsTrack.updateIsSavingDropboxTrack({
            isSavingDropboxTrack: false,
          }),
        );
      },
      process: function () {},
      cancel: function () {
        removeLocalStorage('trackId');
        dispatch(
          actionsTrack.updateIsSavingDropboxTrack({
            isSavingDropboxTrack: false,
          }),
        );
      },
      error: function (error) {
        toastError(
          "Please slow down if you're downloading multiple tracks too fast. Feel free to submit a ticket at Contact Us page for any query. Thank you!",
        );
        const text = `❗️ Track save to Dropbox failed`;
        const block = `❗️ Track save to Dropbox failed\n\`\`\`${JSON.stringify(
          error,
          null,
          2,
        )}\`\`\``;

        sendSlack({
          text,
          block,
          channelId: SLACK_CHANNELS.ERRORS,
          attachments: [
            `Track ID: ${getLocalStorage('trackId')}`,
            `User ID: ${userDetail?._id},`,
          ],
        });
        removeLocalStorage('trackId');
        dispatch(
          actionsTrack.updateIsSavingDropboxTrack({
            isSavingDropboxTrack: false,
          }),
        );
      },
    };
  }, [actionsTrack, dispatch, userDetail?._id]);

  useEffect(() => {
    socket.on('getPreSignUrlTrack', async data => {
      if (data) {
        const downloadTrack = async (data, isUrl2 = false) => {
          const { preSignUrl2, preSignUrl, title, artist, type } = data;
          const downloadUrl = isUrl2 ? preSignUrl2 : preSignUrl;
          await axios
            .get(downloadUrl, { responseType: 'arraybuffer' })
            .then(async response => {
              const blob = new Blob([response.data], {
                type: response.headers['content-type'],
              });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute(
                'download',
                `${artist} - ${title}.${type === AUDIO ? MP3_FILE : MP4_FILE}`,
              );
              document.body.appendChild(link);
              link.click();
              link.remove();
              if (data?.isUpdateNumberDownload) {
                dispatch(
                  actionsTrack.updateNumberDownloadTrackRequest({
                    trackId: data?.trackId,
                  }),
                );
              }

              if (data?.isBuyTrackWithSubscription) {
                dispatch(
                  actionsSubscriptions.updateSubscriptionsAfterBuyTrack(),
                );
                dispatch(
                  actionsWishlists.updateTrackandReleaseinWishlistsInReducer([
                    { _id: data?.trackId },
                  ]),
                );
                dispatch(
                  actionsTrack.buyTrackBySubscriptionSuccess({
                    trackId: data?.trackId,
                  }),
                );
                dispatch(
                  actionsTrackDetail.buyTrackBySubscriptionSuccess({
                    trackId: data?.trackId,
                  }),
                );
                if (data?.isBuyTopTrackWithSubscription) {
                  dispatch(actionsTrack.updateIsDownloadTrackSuccess(true));
                }
                dispatch(actionsTrack.updateTrackBySubscriptionSuccess(false));
                dispatch(actionsTrack.buyTrackIdBySub(null));
                toastSuccess('Download success!');
              }
              sendSlack({
                text: '✅ Track file download succeses',
                block: '✅ Track file download succeses',
                channelId: SLACK_CHANNELS.DOWNLOADS,
                attachments: convertObjectToArray({
                  ...data,
                  userId: userDetail?._id,
                }),
              });
            })
            .catch(error => {
              toastError(
                "Please slow down if you're downloading multiple tracks too fast. Feel free to submit a ticket at Contact Us page for any query. Thank you!",
              );
              sendSlack({
                text: '❗️ Track file download failed',
                block: `❗️ Track file download failed\n\`\`\`${JSON.stringify(
                  error,
                  null,
                  2,
                )}\`\`\``,
                channelId: SLACK_CHANNELS.ERRORS,
                attachments: convertObjectToArray({
                  ...data,
                  userId: userDetail?._id,
                }),
              });
            });
        };
        const dropboxSave = (url, path, options) => {
          return new Promise<void>((resolve, reject) => {
            try {
              (window as any)?.Dropbox.save(url, path, {
                ...options,
                success: async () => {
                  const trackId = getLocalStorage('trackId');
                  dispatch(
                    actionsTrack.updateNumberDownloadTrackRequest({
                      trackId,
                    }),
                  );
                  toastSuccess('Success! Files saved to your Dropbox.');
                  sendSlack({
                    text: '✅ Track save to Dropbox succeses',
                    block: '✅ Track save to Dropbox succeses',
                    channelId: SLACK_CHANNELS.DOWNLOADS,
                    attachments: [
                      `Track ID: ${trackId}`,
                      `User ID: ${userDetail?._id}`,
                    ],
                  });
                  removeLocalStorage('trackId');
                  dispatch(
                    actionsTrack.updateIsSavingDropboxTrack({
                      isSavingDropboxTrack: false,
                    }),
                  );
                  resolve();
                },
                error: error => reject(error),
              });
            } catch (error) {
              reject(error);
            }
          });
        };

        const checkAccessToken = async accessToken => {
          try {
            await axios.post(
              'https://api.dropboxapi.com/2/users/get_current_account', // Gọi API Dropbox đơn giản
              null,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              },
            );
            console.log('Access Token is valid');
            return true;
          } catch (error: any) {
            return false;
          }
        };

        const exchangeCodeForToken = async authorizationCode => {
          const clientId = 'dswpn34kex3r3fy'; // Thay bằng App Key của bạn từ Dropbox App Console
          const redirectUri = 'http://localhost:3000/tracks'; // URL của bạn để nhận mã ủy quyền
          const clientSecret = 'yw1gm6jfepgqpa2';

          try {
            const response = await axios.post(
              'https://api.dropboxapi.com/oauth2/token',
              null,
              {
                params: {
                  code: authorizationCode,
                  grant_type: 'authorization_code',
                  client_id: clientId,
                  client_secret: clientSecret,
                  redirect_uri: redirectUri,
                },
              },
            );
            const accessToken = response.data.access_token;
            setLocalStorage('accessTokenDropbox', accessToken);

            return accessToken;
          } catch (error) {
            console.error('Error exchanging code for token:', error);
          }
        };

        const uploadZipToDropbox = async (zipFile, fileName) => {
          return new Promise<void>(async (resolve, reject) => {
            try {
              const accessToken = getLocalStorage('accessTokenDropbox');
              await axios.post(
                'https://content.dropboxapi.com/2/files/upload',
                zipFile,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                      path: `/${fileName}`,
                      mode: 'add',
                      autorename: true,
                      mute: false,
                    }),
                    'Content-Type': 'application/octet-stream',
                  },
                },
              );
              const trackId = getLocalStorage('trackId');
              dispatch(
                actionsTrack.updateNumberDownloadTrackRequest({
                  trackId,
                }),
              );
              toastSuccess('Success! Files saved to your Dropbox.');
              sendSlack({
                text: '✅ Track save to Dropbox succeses',
                block: '✅ Track save to Dropbox succeses',
                channelId: SLACK_CHANNELS.DOWNLOADS,
                attachments: [
                  `Track ID: ${trackId}`,
                  `User ID: ${userDetail?._id}`,
                ],
              });
              removeLocalStorage('trackId');
              dispatch(
                actionsTrack.updateIsSavingDropboxTrack({
                  isSavingDropboxTrack: false,
                }),
              );
              resolve();
            } catch (error: any) {
              removeLocalStorage('trackId');
              dispatch(
                actionsTrack.updateIsSavingDropboxTrack({
                  isSavingDropboxTrack: false,
                }),
              );
              reject(error);
            }
          });
        };

        if (data?.preSignUrl && data?.preSignUrl2) {
          const { preSignUrl2, preSignUrl, title, artist, typeDownload } = data;

          if (typeDownload === 'dropbox') {
            const accessTokenDropbox = getLocalStorage('accessTokenDropbox');
            let isCheckAccessToken;

            if (accessTokenDropbox) {
              isCheckAccessToken = await checkAccessToken(accessTokenDropbox);
            }

            const clientId = process.env.REACT_APP_KEY_DROPBOX as string;
            const redirectUri = process.env
              .REACT_APP_REDIRECT_URI_DROPBOX_DOWNLOAD as string;
            const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
              redirectUri,
            )}`;

            if (code && !isCheckAccessToken) {
              try {
                await exchangeCodeForToken(code);
              } catch (error) {
                window.location.href = dropboxAuthUrl;
              }
            }

            if (!code && !isCheckAccessToken) {
              window.location.href = dropboxAuthUrl;
            }

            const zip = new JSZip();
            const track1 = await axios.get(preSignUrl, {
              responseType: 'arraybuffer',
            });
            const track2 = await axios.get(preSignUrl2, {
              responseType: 'arraybuffer',
            });
            const cleanUrl = preSignUrl.split('?')[0];
            const parts1 = cleanUrl.split('tracks/');
            const cleanUrl2 = preSignUrl2.split('?')[0];
            const parts2 = cleanUrl2.split('tracks/');
            zip.file(decodeURIComponent(parts1[1]), track1.data);
            zip.file(decodeURIComponent(parts2[1]), track2.data);
            const content = await zip.generateAsync({ type: 'blob' });

            await uploadZipToDropbox(content, `${artist} - ${title}.zip`);
            return content;
          } else {
            const zip = new JSZip();
            const track1 = await axios.get(preSignUrl, {
              responseType: 'arraybuffer',
            });
            const track2 = await axios.get(preSignUrl2, {
              responseType: 'arraybuffer',
            });
            const cleanUrl = preSignUrl.split('?')[0];
            const parts1 = cleanUrl.split('tracks/');
            const cleanUrl2 = preSignUrl2.split('?')[0];
            const parts2 = cleanUrl2.split('tracks/');
            zip.file(decodeURIComponent(parts1[1]), track1.data);
            zip.file(decodeURIComponent(parts2[1]), track2.data);
            zip.generateAsync({ type: 'blob' }).then(content => {
              if (data?.isUpdateNumberDownload) {
                dispatch(
                  actionsTrack.updateNumberDownloadTrackRequest({
                    trackId: data?.trackId,
                  }),
                );
              }

              if (data?.isBuyTrackWithSubscription) {
                dispatch(
                  actionsSubscriptions.updateSubscriptionsAfterBuyTrack(),
                );
                dispatch(
                  actionsWishlists.updateTrackandReleaseinWishlistsInReducer([
                    { _id: data?.trackId },
                  ]),
                );
                dispatch(
                  actionsTrack.buyTrackBySubscriptionSuccess({
                    trackId: data?.trackId,
                  }),
                );
                dispatch(
                  actionsTrackDetail.buyTrackBySubscriptionSuccess({
                    trackId: data?.trackId,
                  }),
                );
                if (data?.isBuyTopTrackWithSubscription) {
                  dispatch(actionsTrack.updateIsDownloadTrackSuccess(true));
                }
                dispatch(actionsTrack.updateTrackBySubscriptionSuccess(false));
                dispatch(actionsTrack.buyTrackIdBySub(null));
                toastSuccess('Download success!');
              }

              sendSlack({
                text: '✅ Track file download succeses',
                block: '✅ Track file download succeses',
                channelId: SLACK_CHANNELS.DOWNLOADS,
                attachments: convertObjectToArray({
                  ...data,
                  userId: userDetail?._id,
                }),
              });
              saveAs(content, `${title} - ${artist}.zip`);
            });
          }
        }

        if (data.preSignUrl && !data.preSignUrl2) {
          if (data.typeDownload === 'dropbox') {
            const pathName = `${data?.title}.${
              data?.type === AUDIO ? MP3_FILE : MP4_FILE
            }`;
            await dropboxSave(data?.preSignUrl, pathName, options);
          } else {
            await downloadTrack(data);
          }
        }

        dispatch(
          actionsTrack.updateIsDownloadingTrack({
            isDownloadingTrack: false,
          }),
        );
      }
    });
    return () => {
      socket.off('getPreSignUrlTrack');
    };
  }, [actionsSubscriptions, actionsTrack, code, dispatch, options, userDetail]);
};
