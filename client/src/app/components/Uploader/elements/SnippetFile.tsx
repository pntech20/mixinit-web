import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import AudioPlayers from 'app/components/AudioPlayers/AudioPlayer';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from './claim.module.scss';

function SnippetFile({
  trackUrl,
  previewUrl,
  secondsPlay,
  setSecondsPlay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  filePreview,
  setFilePreview,
  setPreviewStartAt,
  setPreviewEndAt,
  previewEndAtCurrent,
  previewStartAtCurrent,
}: any) {
  const [isCutting, setCutting] = useState(false);

  const { t } = useTranslation();
  const optionSeconds = [
    {
      label: `30 ${t('uploader.seconds')}`,
      value: 30,
    },
    {
      label: `60 ${t('uploader.seconds')}`,
      value: 60,
    },
    {
      label: `90 ${t('uploader.seconds')}`,
      value: 90,
    },
  ];

  const handleOptionSeconds = value => {
    setSecondsPlay(value);
  };

  // const cutAudioSong = useCallback(async (cutStart, cutEnd, file) => {
  //   const formData = new FormData();
  //   formData.append('startTime', cutStart.toString().split('.')[0]);
  //   formData.append('duration', (cutEnd - cutStart).toFixed(2));
  //   formData.append('fileUrl', file);
  //   try {
  //     const data = await createTrackAudioPreview(formData);
  //     const buff = Buffer.from(data.blob, 'base64');
  //     const blob = new Blob([buff], { type: AUDIO_TYPE });
  //     return blob;
  //   } catch (error) {
  //     toastError('Something went wrong!');
  //     return null;
  //   }
  // }, []);

  // const checkTypeFile = useCallback(file => {
  //   if (file.type === VIDEO_TYPE) return MP4_FILE;
  //   if (file.type === WAV_TYPE) return WAV_FILE;
  //   return MP3_FILE;
  // }, []);

  // const blobToFile = useCallback(
  //   (theBlob, file) => {
  //     const typeFile = checkTypeFile(file);
  //     return new File([theBlob], `${file.name}`, {
  //       lastModified: new Date().getTime(),
  //       type: typeFile === MP4_FILE ? VIDEO_TYPE : AUDIO_TYPE,
  //     });
  //   },
  //   [checkTypeFile],
  // );

  const handleClickSaveSnippet = useCallback(async () => {
    if (secondsPlay === 0) {
      toast.error(t('uploader.messageSnippet'));
      return;
    }
    setCutting(true);
    // const { startTime, endTime } = data;
    setPreviewStartAt(startTime);
    setPreviewEndAt(endTime);
    setCutting(false);
    toast.success(t('uploader.successSaveSnippet'));
    // setCutting(true);
    // try {
    //   const blob = await cutAudioSong(startTime, endTime, trackUrl);
    //   if (blob) {
    //     setFilePreview(null);
    //     const fileTrack = {
    //       type: MP3_FILE,
    //       name: previewUrl || trackUrl,
    //     };
    //     const filePreview = await blobToFile(blob, fileTrack);
    //     setFilePreview(filePreview);
    //     toast.success(t('uploader.successSaveSnippet'));
    //   }
    //   setCutting(false);
    // } catch (error) {
    //   setCutting(false);
    //   toastError('Something went wrong!');
    // }
  }, [secondsPlay, setPreviewStartAt, startTime, setPreviewEndAt, endTime, t]);

  return (
    <Box>
      <Text fontSize="14px">({t('uploader.useTheTrackEditor')})</Text>
      <Flex margin="10px 0" gridGap={5}>
        {optionSeconds.map((item, index) => (
          <label key={index} className={styles.optionSecond}>
            <input
              type="radio"
              checked={secondsPlay === item.value}
              onChange={() => {
                handleOptionSeconds(item.value);
              }}
            />
            <span className={styles.checkmark}>{item.label}</span>
          </label>
        ))}
      </Flex>

      <Box w="100%" textAlign="center">
        <Text mb="10px" fontWeight="800" textAlign="left">
          Current Track
        </Text>
        <AudioPlayers
          blobToPlay={trackUrl}
          onCut={(start, end) => {
            setStartTime(start);
            setEndTime(end);
          }}
          setPreviewEndAt={setPreviewEndAt}
          setPreviewStartAt={setPreviewStartAt}
          isCutting={isCutting}
          secondsPlay={secondsPlay}
          isEdit={true}
          isShowCuttingRegion={true}
          previewEndAtCurrent={previewEndAtCurrent}
          previewStartAtCurrent={previewStartAtCurrent}
        />
      </Box>
      <Button
        p="8px 30px"
        backgroundColor="black"
        color="white"
        marginLeft="auto"
        display="block"
        onClick={handleClickSaveSnippet}
        disabled={isCutting}
        mb="20px"
      >
        {isCutting ? <Spinner /> : t('uploader.saveSnippet')}
      </Button>
    </Box>
  );
}

export default SnippetFile;
