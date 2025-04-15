import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Skeleton,
  SkeletonText,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { getFullUrlTrack } from 'app/apis/track';
import { ApiUploadS3 } from 'app/apis/uploadS3';
import { DropzoneFile } from 'app/components/DropZoneFile';
import Empty from 'app/components/Empty';
import SelectInput from 'app/components/SelectInput';
import { renderLoadingTracks } from 'app/components/TrackUtils/track';
import { AUDIO, VIDEO } from 'app/constants';
import { toastError } from 'app/helpers/toast';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useStepTwo } from 'app/hooks/uploader/useStepTwo';
import { useUploader } from 'app/hooks/uploader/useUploader';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ClaimSample from '../elements/ClaimSample';
import SnippetFile from '../elements/SnippetFile';
import SongRow from '../elements/SongRow';
import TrackInfo from '../elements/TrackInfo';
import './styles.scss';
import getBlobDuration from 'get-blob-duration';
import { BITRATE_MP3 } from 'app/constants/enum';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const UploaderStepTwo = ({ dataFromStepOne, setValueLabelSelected, track }) => {
  const { t } = useTranslation();

  const { userDetail: userInfo } = useSelector(selectAuth);
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const history = useHistory();
  const { colorMode } = useColorMode();
  const fileInputRef = useRef<any>(null);

  const song = {
    ...track,
    bpmStart: track?.bpmStart,
    bpmEnd: track?.bpmEnd,
    tags: track?.tags.map(i => ({
      label: i.name,
      value: i._id,
    })),
    genre: {
      label: track?.genre.name,
      value: track?.genre._id,
    },
    subGenre: track?.subGenre
      ? {
          label: track?.subGenre?.name,
          value: track?.subGenre?._id,
        }
      : null,
    subGenre2: track?.subGenre2
      ? {
          label: track?.subGenre2?.name,
          value: track?.subGenre2?._id,
        }
      : null,
    label: {
      label: track?.label.name,
      value: track?.label._id,
    },
  };

  const [fileSnippetUpload, setFileSnippetUpload] = useState<any>(null);
  const [typeSnippet, setTypeSnippet] = useState<string>('creator');
  const [trackUrl, setTrackUrl] = useState<any>('');
  const [dataClaimSample, setDataClaimSample] = useState<any>(
    track?.samples || null,
  );
  const [editableSong, setEditableSong] = useState(song);
  const [isOriginal, setIsOriginal] = useState<boolean>(
    track?.isOriginal || false,
  );
  const [listClaimSamples, setListClaimSamples] = useState<Array<any>>(
    track?.samples || [],
  );

  const [secondsPlay, setSecondsPlay] = useState<number>(() => {
    if (!track || !track?.previewEndAt || track?.previewEndAt === 0) return 90;
    return Math.floor(track.previewEndAt - track.previewStartAt);
  });

  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [filePreview, setFilePreview] = useState<any>(null);
  const [previewStartAt, setPreviewStartAt] = useState<number>(
    track?.previewStartAt || 0,
  );
  const [previewEndAt, setPreviewEndAt] = useState<number>(
    track?.previewEndAt || 90,
  );

  const {
    updateTrack,
    isUpdatingTrack,
    setIsUpdatingTrack,
    isUpdatingTrackSuccess,
    setIsUpdatingTrackSuccess,
  } = useTracks();

  const {
    handleFilesSelected,
    listOptionSortBy,
    onGetMyDraftTracks,
    myDraftTracks,
    setValueSearch,
    setValueSort,
    valueSort,
    isLoadingDraftTracks,
    isCreatingDraftTrack,
    handleMedia,
    isAudio,
    progress,
  } = useStepTwo(dataFromStepOne);

  const { handlePublishAll } = useUploader(dataFromStepOne);

  const renderSong = useCallback(
    medias => {
      return (
        <>
          {medias.map(item => {
            return (
              <SongRow
                key={item._id}
                media={item}
                dataFromStepOne={dataFromStepOne}
              />
            );
          })}
        </>
      );
    },
    [dataFromStepOne],
  );

  const TrackItemSkeleton = () => {
    return (
      <Grid
        h="60px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(8, 1fr)"
        gap={2}
        mt="20px"
      >
        <GridItem rowSpan={2} colSpan={1}>
          <Skeleton height="55px" />
        </GridItem>
        <GridItem colSpan={6}>
          <SkeletonText noOfLines={3} />
        </GridItem>
        <GridItem rowSpan={2} colSpan={1}>
          <CircularProgress
            size="55px"
            value={progress}
            defaultValue={0}
            color="green.400"
          >
            <CircularProgressLabel></CircularProgressLabel>
          </CircularProgress>
        </GridItem>
      </Grid>
    );
  };

  useEffect(() => {
    onGetMyDraftTracks();
  }, [onGetMyDraftTracks]);

  useEffect(() => {
    if (isUpdatingTrackSuccess) {
      history.push('/my-media');
      setIsUpdatingTrackSuccess(false);
    }
  }, [history, isUpdatingTrackSuccess, setIsUpdatingTrackSuccess]);

  const renderDropzoneFile = useCallback(() => {
    return (
      <DropzoneFile
        passFile={files => handleFilesSelected(files)}
        type={isAudio ? '.mp3' : 'video/*'}
        accept={isAudio ? AUDIO : VIDEO}
      />
    );
  }, [handleFilesSelected, isAudio]);

  useEffect(() => {
    const getTrackURL = async track => {
      const data: any = await getFullUrlTrack({
        trackId: track?._id,
      });
      setTrackUrl(data?.url);
    };
    if (track) {
      getTrackURL(track);
    }
  }, [track]);

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

  const isReadyTrackInfo = useMemo(() => {
    const { title, artist, year, bpmStart, price, tags, genre } = editableSong;
    const { contributorPricing, defaultTrackPrice } = dataFromStepOne;
    const priceValidate = !contributorPricing ? defaultTrackPrice : price;
    if (
      title &&
      artist &&
      year &&
      bpmStart &&
      tags?.length &&
      genre &&
      priceValidate
    ) {
      return true;
    } else {
      return false;
    }
  }, [dataFromStepOne, editableSong]);

  const handleUpdateTrack = async () => {
    setIsUpdatingTrack(true);
    const {
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
      label,
    } = editableSong;

    let listSampleId: any = [];

    let previewUrl = track?.previewUrl;

    if (filePreview && typeSnippet !== 'creator') {
      const resUpload = await handlePreviewUrlTrack();
      previewUrl = resUpload?.data;
    }

    const dataUpdate = {
      title,
      isClean,
      artist,
      year: parseInt(year),
      bpmStart: parseInt(bpmStart),
      bpmEnd: bpmEnd ? parseInt(bpmEnd) : parseInt(bpmStart),
      tags: tags.map(tag => tag.value),
      genre: genre.value,
      subGenre: subGenre ? subGenre.value : null,
      subGenre2: subGenre2 ? subGenre2.value : null,
      price: Number(price),
      samples: listSampleId,
      previewUrl,
      isOriginal: isOriginal,
      dataClaimSample,
      previewStartAt: typeSnippet === 'creator' ? previewStartAt : null,
      previewEndAt: typeSnippet === 'creator' ? previewEndAt : null,
      label: label.value || label._id,
      hasCustomPreview: typeSnippet !== 'creator',
    };

    await updateTrack(track?._id, dataUpdate);
  };

  const renderSelectLabels = useCallback(() => {
    return (userInfo?.canUploadToLabels || [])?.map(value => {
      return {
        ...value,
        value: value?._id,
        label: value?.name,
      };
    });
  }, [userInfo?.canUploadToLabels]);

  useEffect(() => {
    dataFromStepOne?._id === '6644819d030b5549b5c98d32'
      ? handleMedia(VIDEO)
      : handleMedia(AUDIO);
  }, [dataFromStepOne?._id, handleMedia]);

  return !track ? (
    <Box w="100%" className="step-two" marginTop="50px">
      <Flex className="ctn-btn">
        {dataFromStepOne?._id === '6644819d030b5549b5c98d32' ? (
          <Button
            className={classNames('btn-video', {
              active: true,
            })}
            onClick={() => {
              handleMedia(VIDEO);
            }}
            disabled={true}
          >
            {t('uploader.videoTab')}
          </Button>
        ) : (
          <Button
            className={classNames('btn-audio', {
              active: true,
            })}
            onClick={() => {
              handleMedia(AUDIO);
            }}
            disabled={true}
          >
            {t('uploader.audioTab')}
          </Button>
        )}
      </Flex>

      {renderDropzoneFile()}
      <Flex alignItems="center" gridGap="15px" m="30px 0px">
        <Box w="20%">
          <SelectInput
            options={renderSelectLabels()}
            value={{
              label: dataFromStepOne?.name,
              value: dataFromStepOne?._id,
            }}
            onChange={newValue => setValueLabelSelected(newValue)}
            placeholder="Select your label"
            isColorInput
            isSearchable={false}
          />
        </Box>
        <Box w="20%">
          <SelectInput
            options={listOptionSortBy?.map(op => ({
              value: op?.value,
              label: op?.label,
            }))}
            value={valueSort}
            onChange={newValue => setValueSort(newValue)}
            placeholder="Sort by"
            isColorInput
            isSearchable={false}
          />
        </Box>
        <InputGroup w="60%">
          <InputLeftElement
            pointerEvents="none"
            children={<BiSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Search file name"
            _placeholder={{ color: '#d4d4d4' }}
            onChange={e => setValueSearch(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </InputGroup>
      </Flex>
      <Box padding="20px 0px">
        {myDraftTracks?.length > 0 && (
          <Flex justify="flex-end" className="right" mb="30px">
            <Button
              onClick={handlePublishAll}
              backgroundColor="green"
              color="#fff"
              _hover={{
                background: 'green',
                color: '#fff',
              }}
            >
              Publish All
            </Button>
          </Flex>
        )}
        {isCreatingDraftTrack && TrackItemSkeleton()}
        {isLoadingDraftTracks ? (
          renderLoadingTracks(5)
        ) : !isCreatingDraftTrack && myDraftTracks?.length === 0 ? (
          <Empty />
        ) : (
          renderSong(myDraftTracks)
        )}
      </Box>
    </Box>
  ) : (
    <Box>
      <TrackInfo
        dataFromStepOne={dataFromStepOne}
        editableSong={editableSong}
        setEditableSong={setEditableSong}
        isEdit
      />
      <Box
        mt="20px"
        bgColor={colorMode === 'dark' ? 'var(--chakra-colors-gray-700)' : ''}
      />
      <Text className="trackMetadata">Create a Snippet File:</Text>
      {track?.type === AUDIO && (
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

      {typeSnippet === 'creator' && trackUrl ? (
        track?.type === VIDEO ? (
          // <SnippetFileVideo
          //   track={trackUrl}
          //   setPreviewEndAt={setPreviewEndAt}
          //   setPreviewStartAt={setPreviewStartAt}
          // />

          <SnippetFile
            trackUrl={trackUrl}
            secondsPlay={secondsPlay}
            setSecondsPlay={setSecondsPlay}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            setPreviewEndAt={setPreviewEndAt}
            setPreviewStartAt={setPreviewStartAt}
            previewEndAtCurrent={track?.previewEndAt}
            previewStartAtCurrent={track?.previewStartAt}
          />
        ) : (
          <SnippetFile
            trackUrl={trackUrl}
            secondsPlay={secondsPlay}
            setSecondsPlay={setSecondsPlay}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            setPreviewEndAt={setPreviewEndAt}
            setPreviewStartAt={setPreviewStartAt}
            previewEndAtCurrent={track?.previewEndAt}
            previewStartAtCurrent={track?.previewStartAt}
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
            <Text>(File must be mp3 file and cannot allow exceed 128kbps)</Text>
          </Flex>
          {fileSnippetUpload && (
            <Text mt="10px" fontWeight="500" fontStyle="italic">
              {fileSnippetUpload?.name}
            </Text>
          )}
        </Box>
      )}

      <ClaimSample
        passDataOfClaimSample={receiveDataOfClaimSample}
        data={track?.samples}
        listClaimSamples={listClaimSamples}
        setListClaimSamples={setListClaimSamples}
        setIsOriginal={setIsOriginal}
        isOriginal={isOriginal}
      />
      <Button
        padding="10px 40px"
        display="flex"
        margin="0 auto"
        mt="40px"
        backgroundColor="#5c94e8"
        color="#fff"
        disabled={!isReadyTrackInfo || isUpdatingTrack}
        onClick={handleUpdateTrack}
      >
        {isUpdatingTrack ? <Spinner /> : 'Update'}
      </Button>
    </Box>
  );
};

export default UploaderStepTwo;
