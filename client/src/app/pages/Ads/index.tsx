import {
  Box,
  Button,
  Image as ChakraImage,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { OTHERS_FOLDER_UPLOAD_S3 } from 'app/constants';
import { toastError, toastSuccess } from 'app/helpers/toast';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '../Login/slice/selectors';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ApiUploadS3 } from 'app/apis/uploadS3';
import { getMyAds, getMyAdsApprove, onCreateAds } from 'app/apis/ads';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { onCancelAds } from 'app/apis/ads/ads';
import { useAuthSlice } from '../Login/slice';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

dayjs.extend(utc);
dayjs.extend(timezone);
export function AdsPage() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const [isLoading, setIsLoaing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileUrl, setFileUrl] = useState<any>();
  const [link, setLink] = useState<string>('');
  const { userDetail } = useSelector(selectAuth);
  const [myAds, setMyAds] = useState<any>([]);
  const [idAds, setIdAds] = useState<any>();
  const [numOfAds, setNumOfAds] = useState(userDetail?.numOfAds);
  const [isLoadingCancelAds, setIsLoadingCancelAds] = useState<any>(false);
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();
  const [myAdsApproved, setMyAdsApproved] = useState<any>([]);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const path = useMemo(() => {
    return `${OTHERS_FOLDER_UPLOAD_S3}/${userDetail?.username}/ads`;
  }, [userDetail?.username]);
  const { isLargerThan992 } = useMediaScreen();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const tempImage = new window.Image();
      tempImage.src = URL.createObjectURL(file);
      tempImage.onload = () => {
        if (tempImage.width === 1440 && tempImage.height === 180) {
          setImage(tempImage.src);
          setFileUrl(file);
        } else {
          toastError('The image size must be exactly 1440px x 180px.');
          setImage(null);
        }
      };
    }
  };

  const handleCancelAds = async () => {
    setIsLoadingCancelAds(true);
    const res = await onCancelAds(idAds);
    if (res.status === 'Approved') {
      const data = myAdsApproved.filter(item => item._id !== res._id);
      setMyAdsApproved([...data]);
      const newAds = myAds.map(item => {
        if (item._id === res._id) {
          return res;
        }
        return item;
      });
      setMyAds(newAds);
    }
    if (res.status === 'Pending') {
      const data = myAds.filter(item => item._id !== idAds);
      setMyAds([...data]);
      dispatch(
        actions.updateUserSuccess({
          numOfAds: numOfAds + 1,
        }),
      );
      setNumOfAds(numOfAds + 1);
    }
    setIsLoadingCancelAds(false);
    setIsShowModalConfirm(false);
    toastSuccess('Cancel successfully!');
  };

  const handleClick = useCallback(() => {
    if (myAdsApproved.length === 4) {
      toastError('You can only have max 4 running ads.');
    } else if (numOfAds > 0) {
      inputRef.current?.click();
    } else {
      toastError(`You have run out of Ads credits!`);
    }
  }, [numOfAds, myAdsApproved.length]);

  const processUrl = url => {
    const baseUrls = [
      'https://app.crooklynclan.net/',
      'http://localhost:3000/',
      'https://cc-fe-stg-c9a6bbef18cc.herokuapp.com/',
    ];

    // Tìm base URL phù hợp và loại bỏ nó
    const matchedBaseUrl = baseUrls.find(base => url.startsWith(base));
    if (!matchedBaseUrl) return null;

    const remainingPath = url.replace(matchedBaseUrl, '');
    return remainingPath.split('/')[0];
  };

  const handleSubmitAds = async () => {
    if (!link.trim()) {
      toastError('Link is required.');
      return;
    }

    const baseUrls = [
      'https://app.crooklynclan.net/',
      'http://localhost:3000/',
      'https://cc-fe-stg-c9a6bbef18cc.herokuapp.com/',
    ];

    // Ensure the incoming link is properly URL-encoded
    const encodedLink = encodeURI(link);
    const matchedBaseUrl = baseUrls.find(base => encodedLink.startsWith(base));

    if (!matchedBaseUrl) {
      toastError('The URL is invalid.');
    }

    // const regex =
    //   /^(https:\/\/app\.crooklynclan\.net\/(tracks|multipacks|contributors)|http:\/\/localhost:3000\/(tracks|multipacks|contributors)|https:\/\/cc-fe-stg-c9a6bbef18cc\.herokuapp\.com\/(tracks|multipacks|contributors))(\/[\w\-_.~!$&'()*+,;=:@[\]%]*)?(\?[\w\-_.~!$&'()*+,;=:@[\]%]+(=[\w\-_.~!$&'()*+,;=:@[\]%]*)?(&[\w\-_.~!$&'()*+,;=:@[\]%]+(=[\w\-_.~!$&'()*+,;=:@[\]%]*)?)*)?$/i;

    // if (!regex.test(link.trim())) {
    //   toastError('The URL is invalid.');
    //   return;
    // }

    if (!image) {
      toastError('Image is required.');
      return;
    }

    try {
      setIsLoaing(true);
      const result = await ApiUploadS3({
        file: fileUrl,
        path,
      });
      const payload = {
        adsImageUrl: result?.data,
        link: link.trim(),
        page: processUrl(link.trim()),
      };
      const res = await onCreateAds(payload);
      setMyAds([...myAds, res]);
      setNumOfAds(numOfAds - 1);
      dispatch(
        actions.updateUserSuccess({
          numOfAds: numOfAds - 1,
        }),
      );
      if (res.status === 'Approved') {
        setMyAdsApproved([...myAdsApproved, res]);
      }
      setImage(null);
      setFileUrl('');
      setLink('');
      setIsLoaing(false);
      toastSuccess('Submit successfully!');
    } catch (error: any) {
      toastError(error?.response?.data?.message || 'Submit failed!');
      setIsLoaing(false);
    }
  };

  const handleGetMyAds = useCallback(async () => {
    const res: any = await getMyAds();
    setMyAds(res);
  }, []);

  const handleGetMyAdsApprove = useCallback(async () => {
    const res: any = await getMyAdsApprove();
    setMyAdsApproved(res);
  }, []);

  useEffect(() => {
    handleGetMyAds();
    handleGetMyAdsApprove();
  }, [handleGetMyAds, handleGetMyAdsApprove]);

  const truncateLink = link => {
    const maxLength = 80;
    return link.length > maxLength
      ? `${link.substring(0, maxLength)}...`
      : link;
  };

  return (
    <Box>
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      {pageHeader?.adCenter && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.adCenter)}
        </Box>
      )}

      <Box>
        <Box
          border="1px dashed black"
          width="100%"
          maxW="1440px"
          height="180px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="#f0f0f0"
          cursor="pointer"
          onClick={handleClick}
        >
          {image ? (
            <ChakraImage
              src={image}
              alt="Uploaded"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Flex>
              <Text fontWeight="bold">Select Image (1440px x 180px)</Text>
              <Text as="span" color="red">
                *
              </Text>
            </Flex>
          )}
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </Box>
        <Flex w="100%" mt="10px" alignItems="center" gridGap="5px">
          <Text fontSize="14px" fontWeight={600}>
            Link:
          </Text>
          <Input onChange={e => setLink(e.target.value)} value={link} />
        </Flex>
        <Flex justifyContent="center" mt="15px">
          <Button
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={handleSubmitAds}
          >
            Publish
          </Button>
        </Flex>
      </Box>
      <Box mt="30px">
        <Flex
          bg="#000"
          fontWeight={600}
          fontSize={14}
          justifyContent="space-between"
          mb="10px"
          color="#fff"
          p="2px 10px"
        >
          <Text>MY ADS</Text>
          <Text>AD CREDITS: {numOfAds}</Text>
        </Flex>
        <Box>
          <table
            cellPadding="10"
            cellSpacing="0"
            style={{ width: '100%', textAlign: 'left' }}
          >
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Link</th>
                <th>Clicks</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myAds.map((ads: any, index) => (
                <tr key={index}>
                  <td>
                    {ads?.startTime
                      ? new Date(ads?.startTime).toLocaleString()
                      : ''}
                  </td>
                  <td>
                    {ads?.endTime
                      ? new Date(ads?.endTime).toLocaleString()
                      : ''}
                  </td>
                  <td>{ads?.status}</td>
                  <td> {truncateLink(ads?.link)}</td>
                  <td>
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                      {ads?.adClickCount || 0}
                    </Box>
                  </td>
                  <td>
                    {ads.status === 'Pending' ? (
                      <Button
                        h="32px"
                        fontSize="12px"
                        onClick={() => {
                          setIsShowModalConfirm(true);
                          setIdAds(ads._id);
                        }}
                      >
                        Cancel
                      </Button>
                    ) : (ads.status === 'Approved' &&
                        ads.isActive &&
                        ads.deletedAt) ||
                      (ads.status === 'Approved' && !ads.isActive) ? (
                      <Button h="32px" fontSize="12px" color="red">
                        ENDED
                      </Button>
                    ) : ads.status === 'Approved' && ads.isActive ? (
                      <Button
                        h="32px"
                        fontSize="12px"
                        onClick={() => {
                          setIsShowModalConfirm(true);
                          setIdAds(ads._id);
                        }}
                      >
                        END NOW
                      </Button>
                    ) : (
                      <Text></Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
      <Modal
        onClose={() => setIsShowModalConfirm(false)}
        isOpen={isShowModalConfirm}
      >
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Are you sure you want to end this ad campaign early? You will not
              receive a refund on your ad credit.
            </ModalHeader>
            <ModalFooter>
              <Button
                isLoading={isLoadingCancelAds}
                isDisabled={isLoadingCancelAds}
                bg="#EDF2F7"
                color="#1A202C"
                onClick={handleCancelAds}
              >
                Proceed
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </Box>
  );
}
