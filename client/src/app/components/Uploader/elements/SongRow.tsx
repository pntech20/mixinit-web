import { useColorMode } from '@chakra-ui/color-mode';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import * as trackApis from 'app/apis/track';
import { ApiUploadS3 } from 'app/apis/uploadS3';
import AudioPlayers from 'app/components/AudioPlayers/AudioPlayer';
import { AUDIO, VIDEO } from 'app/constants';
import { BITRATE_MP3 } from 'app/constants/enum';
import { getLocalStorage } from 'app/helpers/local-storage';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { actionsAuth } from 'app/pages/Login/slice';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import getBlobDuration from 'get-blob-duration';
import { isEmpty } from 'ramda';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import AdditionalInfo from './AdditionalInfo';
import ClaimSample from './ClaimSample';
import SnippetFile from './SnippetFile';
import TrackInfo from './TrackInfo';
import './songRow.scss';

interface SongRowProps {
  media: any;
  dataFromStepOne?: any;
}

interface SongClaimSample {
  _id: string;
  source: string;
  track: string;
  originalTrackUrl?: string;
}

function SongRow({ media, dataFromStepOne }: SongRowProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { userDetail: userInfo } = useSelector(selectAuth);

  // const { onShowLoading, onHideLoading } = useGlobalUI();
  const { actions } = useTrackSlice();
  const dispatch = useDispatch();

  const { _id } = media;
  const [typeSnippet, setTypeSnippet] = useState<string>('creator');
  const [fileSnippetUpload, setFileSnippetUpload] = useState<any>(null);
  const [dataClaimSample, setDataClaimSample] = useState<any>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(true);
  const [isOriginal, setIsOriginal] = useState<boolean>(media?.isOriginal);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [editableSong, setEditableSong] = useState<any>(media);
  const [secondsPlay, setSecondsPlay] = useState<number>(() => {
    if (
      media.previewStartAt &&
      media.previewEndAt &&
      media.previewEndAt - media.previewStartAt > 0
    ) {
      return Math.floor(media.previewEndAt) - Math.floor(media.previewStartAt);
    }
    return 90;
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [filePreview, setFilePreview] = useState<any>(null);
  const [previewStartAt, setPreviewStartAt] = useState<number>(
    media?.previewStartAt || 0,
  );
  const [previewEndAt, setPreviewEndAt] = useState<number>(
    media?.previewEndAt || 90,
  );
  const [listClaimSamples, setListClaimSamples] = useState<
    Array<SongClaimSample>
  >([]);

  const receiveDataOfClaimSample = useCallback(data => {
    setDataClaimSample(data);
  }, []);

  const onChangeFileSnippet = async event => {
    const file = event.target.files[0];
    const durationFile = await getBlobDuration(
      window.URL.createObjectURL(file),
    );
    const kbit = file.size / 128; //calculate bytes to kbit
    const kbps = Math.ceil(Math.round(kbit / durationFile) / 16) * 16;
    if (kbps > BITRATE_MP3.KBPS128) {
      return toastError(`File cannot allow exceed 128kbps`);
    }
    setFilePreview(null);
    setFileSnippetUpload(file);
    setFilePreview(file);
  };

  const handlePreviewUrlTrack = useCallback(async () => {
    const res = await ApiUploadS3({
      file: filePreview,
      path: `${dataFromStepOne?.name}/${userInfo?.username}/snippets`,
    });
    return res;
  }, [dataFromStepOne?.name, filePreview, userInfo?.username]);

  // window.onbeforeunload = event => {
  //   const e = event || window.event;
  //   if (!dataTrackInfo || !blobFileCut || (!isOriginal && !dataClaimSample)) {
  //   } else {
  //     e.preventDefault();
  //     return 'Are you sure you want to leave this page? you have tracks that have not been published and all changes will be lost.';
  //   }
  // };

  const isReadyTrackInfo = useMemo(() => {
    const {
      title,
      artist,
      year,
      bpmStart,
      price,
      tags,
      genre,
      fileNameOriginal2,
      file,
      isClean,
    } = editableSong;
    const { contributorPricing, defaultTrackPrice } = dataFromStepOne;
    const priceValidate = !contributorPricing ? defaultTrackPrice : price;

    const isCleanAndFileCheck =
      isClean !== null || (isClean === null && (fileNameOriginal2 || file));

    if (
      title &&
      artist &&
      year &&
      bpmStart &&
      tags?.length &&
      genre &&
      priceValidate &&
      isCleanAndFileCheck
    ) {
      return true;
    } else {
      return false;
    }
  }, [dataFromStepOne, editableSong]);

  const isReadySnippet = useMemo(() => {
    const isTypeSnippet = typeSnippet === 'upload' && !fileSnippetUpload;
    if (media?.previewUrl) {
      return true;
    } else {
      if (
        (!filePreview && previewStartAt !== 0 && !previewStartAt) ||
        isTypeSnippet
      ) {
        return false;
      } else {
        return true;
      }
    }
  }, [
    filePreview,
    fileSnippetUpload,
    media?.previewUrl,
    previewStartAt,
    typeSnippet,
  ]);

  const isReadyPublic = useMemo(() => {
    return isReadyTrackInfo && isReadySnippet;
  }, [isReadySnippet, isReadyTrackInfo]);

  const handleSaveDraft = async isDraft => {
    let {
      title,
      artist,
      isClean,
      bpmStart,
      bpmEnd,
      year,
      tags,
      genre,
      subGenre,
      subGenre2,
      price,
      previewUrl,
      file,
    } = editableSong;
    bpmStart = Number(bpmStart);
    bpmEnd = Number(bpmEnd);
    try {
      if (isDraft) {
        setIsSavingDraft(true);
      } else {
        setIsPublishing(true);
      }
      if (filePreview) {
        const resUpload = await handlePreviewUrlTrack();
        previewUrl = resUpload?.data;
      }
      const data = {
        title,
        artist,
        bpmStart,
        bpmEnd,
        year: parseInt(year),
        previewUrl,
        tags: tags?.map(tag => tag?.value || tag?._id) || [],
        genre: genre ? genre.value : null,
        subGenre: subGenre ? subGenre.value : null,
        subGenre2: subGenre2 ? subGenre2.value : null,
        price,
        isClean,
        isOriginal,
        dataClaimSample,
        isDraft,
        previewStartAt: typeSnippet === 'creator' ? previewStartAt : null,
        previewEndAt: typeSnippet === 'creator' ? previewEndAt : null,
        hasCustomPreview: typeSnippet !== 'creator',
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('file', file);
      const res: any = await trackApis.updateDraftTrack({
        formData,
        trackId: _id,
      });
      if (res?.data) {
        dispatch(actions.updateGetTokenMaxSuccess(res.data.price));
        if (!res?.data?.isDraft) {
          dispatch(
            actionsAuth.updateTotalUploadTrackOfLabel(dataFromStepOne?._id),
          );
        }
        const isPublishAllNow = getLocalStorage('isPublishAllNow');
        if (isEmpty(isPublishAllNow)) {
          if (!res?.data?.isDraft) {
            await trackApis.publishTracks({
              trackIds: [_id],
              labelId: dataFromStepOne?._id,
            });
            setIsPublishing(false);
            dispatch(actions.deleteDraftTracks({ trackIds: [_id] }));
            toastSuccess('Publish success');
          } else {
            setIsSavingDraft(false);
            toastSuccess('Save draft success');
          }
        } else {
          dispatch(
            actions.updateListTracksUploadedSuccess({
              status: true,
              id: _id,
            }),
          );
        }
      }
    } catch (error: any) {
      console.log({ error });
      if (isDraft) {
        setIsSavingDraft(false);
      } else {
        setIsPublishing(false);
      }
      toastError(error?.response?.data?.message || 'Something went wrong!');
      const isPublishAllNow = getLocalStorage('isPublishAllNow');
      if (!isEmpty(isPublishAllNow)) {
        dispatch(
          actions.updateListTracksUploadedSuccess({
            status: false,
            id: _id,
          }),
        );
      }
    }
  };

  const publishNow = async () => {
    await handleSaveDraft(false);
  };

  const handleNeed = () => {
    setIsOpenDetail(prev => !prev);
  };

  const bgItemSongRow = useColorModeValue('#F3F3F3', '#2A3446');

  useEffect(() => {
    if (media?.tags?.length) {
      const convertTags = media?.tags?.map(t => ({
        label: t?.name,
        value: t?._id,
      }));
      setEditableSong(pre => ({
        ...pre,
        tags: convertTags,
      }));
    }
  }, [media?.tags]);

  useEffect(() => {
    if (media?.genre) {
      setEditableSong(pre => ({
        ...pre,
        genre: {
          label: media?.genre?.name,
          value: media?.genre?._id,
        },
      }));
    }
  }, [media?.genre]);

  useEffect(() => {
    if (media?.subGenre) {
      setEditableSong(pre => ({
        ...pre,
        subGenre: {
          label: media?.subGenre?.name,
          value: media?.subGenre?._id,
        },
      }));
    }
  }, [media?.subGenre]);

  useEffect(() => {
    if (media?.subGenre2) {
      setEditableSong(pre => ({
        ...pre,
        subGenre2: {
          label: media?.subGenre2?.name,
          value: media?.subGenre2?._id,
        },
      }));
    }
  }, [media?.subGenre2]);

  useEffect(() => {
    if (media?.title) {
      if (media?.title.toLowerCase().includes('[clean]')) {
        setEditableSong(pre => ({
          ...pre,
          isClean: true,
        }));
      }
      if (media.title.toLowerCase().includes('[dirty]')) {
        setEditableSong(pre => ({
          ...pre,
          isClean: false,
        }));
      }
      if (media.title.toLowerCase().includes('[clean & dirty]')) {
        setEditableSong(pre => ({
          ...pre,
          isClean: null,
        }));
      }
    }
  }, [media.title]);

  const onDeleteTrack = useCallback(() => {
    dispatch(actions.deleteDraftTrackRequest({ trackId: _id }));
    onClose();
  }, [_id, actions, dispatch, onClose]);

  return (
    <>
      <Box
        className="border-solid"
        bgColor={colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : ''}
      />
      {/* <Prompt
        when={
          !dataTrackInfo || !blobFileCut || (!isOriginal && !dataClaimSample)
            ? false
            : true
        }
        message="Are you sure you want to leave this page? you have tracks that have not been published and all changes will be lost."
      /> */}
      <Flex className="row-4" mt="20px">
        <Flex className="left" mr="10px">
          <Text className="file-name" marginLeft="5px">
            {media?.fileNameOriginal}
          </Text>
        </Flex>
        <Flex className="right">
          <Button
            backgroundColor="gray"
            onClick={() => handleSaveDraft(true)}
            className="btn-needs-prep"
            mr="10px"
            disabled={isSavingDraft}
            color="black"
            sx={{
              '&:hover': {
                backgroundColor: 'gray',
                color: '#fff',
              },
            }}
          >
            Save as Draft
          </Button>

          <Button
            id={!isReadyPublic ? null : _id}
            className="btn-needs-prep"
            onClick={!isReadyPublic ? handleNeed : publishNow}
            sx={{
              '&:hover': {
                backgroundColor: isReadyPublic ? 'green' : 'red',
                color: '#fff',
              },
            }}
            color={isReadyPublic ? 'green' : 'red'}
            backgroundColor={isReadyPublic ? 'green' : 'red'}
            disabled={isPublishing}
          >
            {!isReadyPublic ? t('uploader.needsPrep') : t('uploader.publish')}
          </Button>
          <RiDeleteBin5Fill
            style={{
              marginLeft: '25px',
              cursor: 'pointer',
            }}
            onClick={onOpen}
            size={30}
            color="red"
          />
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete this draft track
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    colorScheme="gray"
                    color="#000000"
                    ref={cancelRef}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={onDeleteTrack} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <Box ml="20px" onClick={handleNeed} cursor="pointer">
            {!isOpenDetail ? (
              <AiFillCaretRight
                color={!isReadyPublic ? 'red' : 'green'}
                fontSize="30px"
              />
            ) : (
              <AiFillCaretDown
                color={!isReadyPublic ? 'red' : 'green'}
                fontSize="30px"
              />
            )}
          </Box>
        </Flex>
      </Flex>
      {/* {isOpenDetail && ( */}
      <Box
        bg={bgItemSongRow}
        borderRadius="10px"
        p="20px 10px"
        marginTop="30px"
        hidden={!isOpenDetail}
      >
        <Box>
          <Text className="track-metadata" ml="0px!important">
            {t('uploader.trackMetadataInformation')}:
          </Text>
          <Box ml="15px">
            <Text className="fill-out-all">
              Automatically written by our system:
            </Text>
            <AdditionalInfo track={media} />
          </Box>
        </Box>
        <TrackInfo
          editableSong={editableSong}
          setEditableSong={setEditableSong}
          dataFromStepOne={dataFromStepOne}
        />
        <Box
          mt="20px"
          bgColor={colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : ''}
        />
        <Text className="trackMetadata">
          {t('uploader.createASnippetFile')}:
        </Text>
        {media?.type === AUDIO && (
          <RadioGroup mb="15px" onChange={setTypeSnippet} value={typeSnippet}>
            <Flex gridGap="30px">
              <Radio colorScheme="green" value="creator">
                Snippet creator
              </Radio>
              <Radio colorScheme="green" value="upload">
                Upload a custom snippet
              </Radio>
            </Flex>
          </RadioGroup>
        )}
        {typeSnippet === 'creator' ? (
          media?.type === VIDEO ? (
            <SnippetFile
              secondsPlay={secondsPlay}
              setSecondsPlay={setSecondsPlay}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              filePreview={filePreview}
              setFilePreview={setFilePreview}
              trackUrl={media?.url}
              setPreviewEndAt={setPreviewEndAt}
              setPreviewStartAt={setPreviewStartAt}
              previewEndAtCurrent={previewEndAt}
              previewStartAtCurrent={previewStartAt}
            />
          ) : (
            // <SnippetFileVideo
            //   track={media?.url}
            //   setPreviewEndAt={setPreviewEndAt}
            //   setPreviewStartAt={setPreviewStartAt}
            // />
            <SnippetFile
              secondsPlay={secondsPlay}
              setSecondsPlay={setSecondsPlay}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              filePreview={filePreview}
              setFilePreview={setFilePreview}
              trackUrl={media?.url}
              setPreviewEndAt={setPreviewEndAt}
              setPreviewStartAt={setPreviewStartAt}
              previewEndAtCurrent={previewEndAt}
              previewStartAtCurrent={previewStartAt}
            />
          )
        ) : (
          <Box mb="20px">
            <Input
              hidden
              type="file"
              accept=".mp3"
              ref={fileInputRef}
              onChange={event => onChangeFileSnippet(event)}
            />

            <Flex alignItems="center" gridGap="10px">
              <Button
                color="unset"
                fontSize={{ base: '12px', md: '16px' }}
                p="9px 15px"
                font
                onClick={() => fileInputRef.current.click()}
              >
                UPLOAD
              </Button>
              <Text>
                (File must be mp3 file and cannot allow exceed 128kbps)
              </Text>
            </Flex>
            {fileSnippetUpload && (
              <Text mt="10px" fontWeight="500" fontStyle="italic">
                {fileSnippetUpload?.name}
              </Text>
            )}
          </Box>
        )}
        {filePreview && typeSnippet === 'creator' && media?.type !== VIDEO && (
          <Box w="100%" textAlign="center">
            <Text mb="10px" fontWeight="800" textAlign="left">
              Current Snippet
            </Text>
            <AudioPlayers
              blobToPlay={filePreview}
              onCut={(start, end) => {
                console.log(start, end);
              }}
              setPreviewEndAt={setPreviewEndAt}
              setPreviewStartAt={setPreviewStartAt}
              secondsPlay={secondsPlay}
              isShowCuttingRegion={false}
            />
          </Box>
        )}

        <ClaimSample
          data={media?.samples}
          passDataOfClaimSample={receiveDataOfClaimSample}
          setIsOriginal={setIsOriginal}
          isOriginal={isOriginal}
          listClaimSamples={listClaimSamples}
          setListClaimSamples={setListClaimSamples}
        />
      </Box>
      {/* )} */}
    </>
  );
}

export default SongRow;
