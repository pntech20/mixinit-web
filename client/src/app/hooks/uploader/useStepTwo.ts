import { convertFilesToSongs } from 'app/components/Uploader/helpers';
import {
  AUDIO,
  AUDIO_TYPE,
  MP3_FILE,
  MP4_FILE,
  SIZE_FILE_TO_MB,
  VIDEO,
  VIDEO_TYPE,
  WAV_FILE,
  WAV_TYPE,
} from 'app/constants';
import { BITRATE_MP3 } from 'app/constants/enum';
import { toastError } from 'app/helpers/toast';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import getBlobDuration from 'get-blob-duration';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as trackApis from 'app/apis/track';

export const useStepTwo = dataFromStepOne => {
  const { t } = useTranslation();

  const listOptionSortBy = [
    {
      label: `${t('uploader.listSortBy.dateAddedDescending')}`,
      value: 'createdAt@desc',
    },
    {
      label: `${t('uploader.listSortBy.dateAddedAscending')}`,
      value: 'createdAt@asc',
    },
    {
      label: `${t('uploader.listSortBy.filenameAZ')}`,
      value: 'fileNameOriginal@asc',
    },
    {
      label: `${t('uploader.listSortBy.filenameZA')}`,
      value: 'fileNameOriginal@desc',
    },
  ];

  const dispatch = useDispatch();
  const { actions } = useTrackSlice();
  const { myDraftTracks, isLoadingDraftTracks } =
    useSelector(selectSliceTracks);

  const [isAudio, setIsAudio] = useState<Boolean>(true);
  const [isCreatingDraftTrack, setIsCreatingDraftTrack] =
    useState<Boolean>(false);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueSort, setValueSort] = useState<any>(listOptionSortBy[0]);
  const [progress, setProgress] = useState(0);

  const checkTypeFile = useCallback(file => {
    if (file.type === VIDEO_TYPE) return MP4_FILE;
    if (file.type === WAV_TYPE) return WAV_FILE;
    return MP3_FILE;
  }, []);

  const handleMedia = useCallback(type => {
    setIsAudio(type === AUDIO);
  }, []);

  const onGetMyDraftTracks = useCallback(() => {
    dispatch(
      actions.getMyDraftTracksRequest({
        labelId: dataFromStepOne?._id,
        search: valueSearch,
        type: isAudio ? AUDIO : VIDEO,
        sort: valueSort?.value,
      }),
    );
  }, [
    actions,
    dataFromStepOne?._id,
    dispatch,
    isAudio,
    valueSearch,
    valueSort?.value,
  ]);

  const handleFilesSelected = useCallback(
    async files => {
      setIsCreatingDraftTrack(true);
      const potentialSongs: any = await convertFilesToSongs(files);
      let promise: any = [];
      for (const [, potentialSong] of potentialSongs.entries()) {
        promise.push(potentialSong);
      }
      const results = await Promise.all(promise);
      for (const item of results) {
        const interval = setInterval(() => {
          setProgress(prevProgress => {
            if (prevProgress >= 95) {
              clearInterval(interval);
              return prevProgress;
            }
            return prevProgress + 1;
          });
        }, 300);
        setProgress(0);
        const {
          song: {
            title,
            artist,
            year,
            tag,
            genre,
            subGenre,
            beatsPerMinute,
            beatsPerMinuteEnd,
            key,
            subGenre2,
          },
          file,
        } = item;

        const pattern = /\[(CLEAN|DIRTY)\]$/;
        const cleanedFilename = file.name.replace(/\.(mp3|mp4)$/, '');

        if (!pattern.test(cleanedFilename)) {
          toastError(`${file.name} must end with [CLEAN] or [DIRTY]`);
          continue;
        }
        const durationFile = await getBlobDuration(
          window.URL.createObjectURL(file),
        );
        if (file.type === AUDIO_TYPE) {
          const kbit = file.size / 128; // Calculate bytes to kbit
          const kbps = Math.ceil(Math.round(kbit / durationFile) / 16) * 16;
          if (kbps < BITRATE_MP3.KBPS320) {
            toastError(`${file.name} must be MP3 320kbps`);
            continue; // Skip to the next item if the condition fails
          }
          const maxFileSizeAudio = 320 * 1024 * 1024; // 320MB
          if (file.size > maxFileSizeAudio) {
            toastError(`${file.name} is larger than max size limit 320MB`);
            continue;
          }
        }

        if (file.type === VIDEO_TYPE) {
          const maxFileSizeVideo = 1024 * 1024 * 1024; // 1GB
          if (file.size > maxFileSizeVideo) {
            toastError(`${file.name} is larger than max size limit 1GB`);
            continue;
          }

          // Check the video resolution
          const video = document.createElement('video');
          video.src = window.URL.createObjectURL(file);
          const resolutionError = await new Promise(resolve => {
            video.onloadedmetadata = () => {
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              let error = false;

              // Only allow exact 1080p (1920x1080)
              if (videoWidth !== 1920 || videoHeight !== 1080) {
                error = true;
                toastError(
                  `${file.name} does not meet the exact allowed resolution of 1080p (1920x1080). Your resolution is ${videoWidth}x${videoHeight}.`,
                );
              }
              resolve(error);
            };
          });

          // If resolutionError is true, skip this file
          if (resolutionError) continue;
        }

        const formData = new FormData();
        const fileType = checkTypeFile(file);
        const fileSize = file.size / SIZE_FILE_TO_MB;
        const data = {
          type: fileType === MP4_FILE ? VIDEO : AUDIO,
          title,
          artist,
          bpmStart: parseInt(beatsPerMinute),
          bpmEnd: beatsPerMinuteEnd
            ? parseInt(beatsPerMinuteEnd)
            : parseInt(beatsPerMinute),
          year: parseInt(year),
          previewUrl: '',
          tags: tag,
          genre,
          subGenre,
          subGenre2,
          label: dataFromStepOne._id,
          price: dataFromStepOne.contributorPricing
            ? Number(dataFromStepOne.minPrice)
            : Number(dataFromStepOne.defaultTrackPrice),
          fileSize: fileSize.toFixed(2),
          trackKey: key,
          duration: durationFile,
          fileNameOriginal: file.name,
        };
        formData.append('data', JSON.stringify(data));
        formData.append('file', file);
        try {
          const res: any = await trackApis.createTrackDraft(formData);
          await dispatch(actions.createTrackDraftSuccess(res?.data));
          setProgress(100);
          clearInterval(interval);
        } catch (error) {
          console.error('Error creating track draft:', error);
        }
      }

      setIsCreatingDraftTrack(false);
    },
    [
      actions,
      checkTypeFile,
      dataFromStepOne._id,
      dataFromStepOne.contributorPricing,
      dataFromStepOne.defaultTrackPrice,
      dataFromStepOne.minPrice,
      dispatch,
    ],
  );

  return {
    handleFilesSelected,
    onGetMyDraftTracks,
    myDraftTracks,
    handleMedia,
    isAudio,
    setValueSearch,
    setValueSort,
    valueSort,
    valueSearch,
    listOptionSortBy,
    isLoadingDraftTracks,
    isCreatingDraftTrack,
    progress,
  };
};
