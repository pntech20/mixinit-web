import { Flex } from '@chakra-ui/layout';
import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { createRequest } from 'app/apis/requests';
import { ENUM_TYPE_REQUEST } from 'app/constants/enum';
import { socket } from 'app/contexts/WebsocketContext';
import { toastSuccess } from 'app/helpers/toast';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { Track } from 'app/models';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { MdCloudDownload } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import BuyTrackBySubscriptionButton from '../BuyTrackBySubscriptionButton';
import { setLocalStorage } from 'app/helpers/local-storage';
import { useSubscriptions } from 'app/hooks/subscription/useSubscriptions';

interface DownloadTrackProps {
  track: Track;
  onclickSubscription?: (trackId: string) => void;
  handleOpenBuyTrackBySub?: any;
}

export default function DownloadTrack({
  track,
  onclickSubscription,
  handleOpenBuyTrackBySub,
}: DownloadTrackProps) {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const [isLoadingSaveDropbox, setLoadingSaveDropbox] = useState(false);
  const {
    isDownloadingTrack,
    isSavingDropboxTrack,
    buyTrackBySubSuccess,
    trackIdBuyBySub,
  } = useSelector(selectSliceTracks);
  const { actions } = useTrackSlice();
  const dispatch = useDispatch();

  const { _id: trackId, numberDownloads, boughtByMe, isMyTrack } = track;

  const { subscriptions } = useSubscriptions();

  const isBuyWithSubscription = useMemo(() => {
    const existedLabel =
      Number(subscriptions?.remaining) > 0 &&
      subscriptions?.labelsIncluded?.includes(track?.label?._id || '');

    return !!existedLabel;
  }, [
    subscriptions?.remaining,
    subscriptions?.labelsIncluded,
    track?.label?._id,
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [valueContent, setValueContent] = useState<string>('');
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { userDetail } = useSelector(selectAuth);

  const { pathname } = useLocation();

  const isMyLibraryPage = useMemo(() => {
    return pathname.includes('/my-library');
  }, [pathname]);

  const isMyMediaPage = useMemo(() => {
    return pathname.includes('/my-media');
  }, [pathname]);

  // const isChartsPage = useMemo(() => {
  //   return pathname.includes('/charts');
  // }, [pathname]);

  const history = useHistory();

  const handleTick = () => {
    history.push(`/my-library`);
  };

  const onSendRequest = useCallback(async () => {
    setLoading(true);
    const data = {
      type: ENUM_TYPE_REQUEST.DOWNLOAD,
      content: valueContent,
      track: trackId,
    };
    const res: any = await createRequest(data);
    if (res.statusCode === 200) {
      onClose();
      toastSuccess('Send success');
      setLoading(false);
    }
  }, [onClose, trackId, valueContent]);

  const downloadTrack = () => {
    setIsLoadingDownload(true);
    dispatch(
      actions.updateIsDownloadingTrack({
        isDownloadingTrack: true,
      }),
    );
    socket.emit('getPreSignUrlTrack', {
      data: {
        trackId,
      },
      clientId: socket.id,
      userId: userDetail._id,
    });
  };

  const handleUploadToDropbox = async () => {
    setLocalStorage('trackId', trackId);
    setLoadingSaveDropbox(true);
    dispatch(
      actions.updateIsSavingDropboxTrack({
        isSavingDropboxTrack: true,
      }),
    );
    socket.emit('getPreSignUrlTrack', {
      data: {
        trackId,
        typeDownload: 'dropbox',
      },
      clientId: socket.id,
      userId: userDetail._id,
    });
  };

  const colorDownload = [3, 4, 5].includes(numberDownloads || 0)
    ? '#008820'
    : track.numberDownloads === 0
    ? '#ff0404'
    : '#DAA520';

  useEffect(() => {
    if (!isDownloadingTrack) setIsLoadingDownload(false);
  }, [isDownloadingTrack]);

  useEffect(() => {
    if (!isSavingDropboxTrack) setLoadingSaveDropbox(false);
  }, [isSavingDropboxTrack, setLoadingSaveDropbox]);

  // if (isMyTrack && isChartsPage) return <></>;

  if (boughtByMe && !isMyLibraryPage)
    return (
      <Box
        color="#138d00"
        fontSize="20px"
        fontWeight="800"
        onClick={handleTick}
        _hover={{ cursor: 'pointer' }}
        w="20px"
        h="20px"
        lineHeight="20px"
      >
        <GiCheckMark />
      </Box>
    );

  if (isMyLibraryPage || isMyMediaPage || isMyTrack)
    return (
      <Box>
        <Flex alignItems="center" direction="row">
          <Box pr="4px" fontSize="16px" fontWeight="800" color={colorDownload}>
            {numberDownloads}
          </Box>
          <Flex w="58px" gridGap="5px">
            {isLoadingDownload ? (
              <Spinner />
            ) : (
              <Flex
                onClick={() => {
                  if (numberDownloads === 0) {
                    onOpen();
                  } else downloadTrack();
                }}
              >
                <Flex
                  alignItems="center"
                  textAlign="center"
                  justifyContent="center"
                  direction="column"
                >
                  <MdCloudDownload
                    color="green"
                    cursor="pointer"
                    fontSize="25px"
                  />
                </Flex>
              </Flex>
            )}

            {isLoadingSaveDropbox ? (
              <Spinner />
            ) : (
              <Image
                cursor="pointer"
                src="https://cfl.dropboxstatic.com/static/metaserver/static/images/logo_catalog/dropbox_logo_glyph_m1.svg"
                h="25px"
                w="25px"
                onClick={() => {
                  if (numberDownloads === 0) {
                    onOpen();
                  } else {
                    handleUploadToDropbox();
                  }
                }}
                alt="Dropbox"
              />
            )}
          </Flex>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              You have run out of downloads for this track. To request an
              additional download, contact the administrator below.
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Textarea
                placeholder="Explanation"
                value={valueContent}
                onChange={e => setValueContent(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={!valueContent || isLoading}
                onClick={onSendRequest}
                colorScheme="blue"
                mr={3}
              >
                {isLoading ? <Spinner /> : 'Send'}
              </Button>
              <Button bg="#EDF2F7" color="#1A202C" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );

  if (buyTrackBySubSuccess || (isBuyWithSubscription && !isMyMediaPage))
    return buyTrackBySubSuccess && trackId === trackIdBuyBySub ? (
      <Box>
        <Spinner />
      </Box>
    ) : (
      <BuyTrackBySubscriptionButton
        trackId={track?._id}
        onclickSubscription={onclickSubscription}
        handleOpenBuyTrackBySub={handleOpenBuyTrackBySub}
      />
    );

  return <></>;
}
