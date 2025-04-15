import { Box, Flex, Text } from '@chakra-ui/react';
import IconNext from 'app/assets/svgs/IconNext';
import IconPrevious from 'app/assets/svgs/IconPrevious';
import { PRESS_KEY_TYPE } from 'app/constants/enum';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { formatTime } from 'app/utils/date';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import {
  FaPause,
  FaPlay,
  FaTrashAlt,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { RiPlayListFill } from 'react-icons/ri';
import LoadingOverlay from 'react-loading-overlay';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './footerPlayer.module.scss';
import FullScreen from 'app/assets/svgs/fullscreen';
import { formatTitle } from 'app/utils/formatTitleTrack';

export function FooterPlayer() {
  const {
    playingTrack,
    volume,
    waveformRef,
    wavesurfer,
    isPlaying,
    loadWaveform,
    handlePlayPause,
    onVolumeChange,
    setIsAudioPlay,
    playingTrackId,
    isOpenPlaylist,
    setIsOpenPlaylist,
    audioList,
    handlePlayOrPause,
    removeAudioList,
    handleNextPrevious,
    handleFastForwardofRewind,
    handleDeleteTrack,
    waveSurfer,
    videoRef,
    onLoadedMetadata,
    isVideoPlaying,
    isShowVideoTrack,
    onVolumeChangeFaVolume,
    isVolume,
    isUseInput,
  } = usePlayers();
  const history = useHistory();
  const { isLargerThan500 } = useMediaScreen();
  const { pathname } = useLocation();

  const isTracksPage = useMemo(() => {
    return pathname.includes('/tracks');
  }, [pathname]);

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        // Firefox
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        // IE/Edge
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleKeyPress = useCallback(
    event => {
      const { key } = event;
      if (!isUseInput) {
        if (key === PRESS_KEY_TYPE.ARROW_RIGHT) {
          handleFastForwardofRewind(true);
        }
        if (key === PRESS_KEY_TYPE.ARROW_LEFT) {
          handleFastForwardofRewind(false);
        }
        if ([' '].includes(key) && !isTracksPage) {
          handlePlayPause(playingTrack);
        }
      }
    },
    [
      handleFastForwardofRewind,
      handlePlayPause,
      isTracksPage,
      isUseInput,
      playingTrack,
    ],
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }
    loadWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => wavesurfer.current.destroy();
  }, [loadWaveform, playingTrackId, wavesurfer]);

  return (
    <Box position="relative" zIndex={100}>
      {isOpenPlaylist && (
        <Box className={styles.container}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom="20px"
          >
            <Text>Previously Played Tracks ({audioList.length})</Text>
            <Flex gridGap="10px" alignItems="center">
              <Box cursor="pointer">
                <FaTrashAlt onClick={removeAudioList} />
              </Box>
              <Box cursor="pointer">
                <AiOutlineCloseCircle
                  size="20px"
                  onClick={() => setIsOpenPlaylist(false)}
                />
              </Box>
            </Flex>
          </Flex>
          <Box
            height="40vh"
            overflowY="auto"
            sx={{
              '::-webkit-scrollbar': {
                display: 'none',
              },
              'scrollbar-width': 'none',
              '-ms-overflow-style': 'none',
            }}
          >
            {audioList?.map(track => (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                key={track?._id}
                color={track?._id === playingTrack?._id ? '#31c27c' : ''}
                cursor="pointer"
                marginBottom="15px"
                className={styles.audioList}
              >
                <Text
                  className={styles.textSong}
                  width="83%"
                  onClick={() => {
                    handlePlayOrPause(track);
                  }}
                >
                  {track?.title}
                </Text>
                <Box cursor="pointer" ml="10px">
                  <AiOutlineCloseCircle
                    size="20"
                    onClick={() => handleDeleteTrack(track._id)}
                  />
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
      <Flex className={styles.containerFooter}>
        <Flex className={styles.ml1}>
          <Box cursor="pointer">
            <IconPrevious
              onClick={() => {
                handleNextPrevious(false);
              }}
            />
          </Box>
          <Box
            padding={isLargerThan500 ? '15px' : 'none'}
            bg={isLargerThan500 ? '#424242' : 'none'}
            borderRadius="50%"
          >
            <Box
              onClick={() => {
                handlePlayPause(playingTrack);
              }}
              cursor="pointer"
            >
              {!isPlaying ? (
                <FaPlay
                  size={isLargerThan500 ? '20px' : '12px'}
                  color="rgba(255, 255, 255, 0.9)"
                />
              ) : (
                <FaPause
                  size={isLargerThan500 ? '20px' : '12px'}
                  color="rgba(255, 255, 255, 0.9)"
                />
              )}
            </Box>
          </Box>
          <Box cursor="pointer">
            <IconNext
              onClick={() => {
                handleNextPrevious(true);
              }}
            />
          </Box>
          <Flex
            alignItems="center"
            padding="2px 7px"
            cursor="pointer"
            gridGap="5px"
            onClick={() => setIsOpenPlaylist(!isOpenPlaylist)}
            bg="#656565"
            borderRadius="20px"
          >
            <RiPlayListFill
              size={isLargerThan500 ? '20px' : '15px'}
              color="#fff"
            />
            <Text color="#fff" fontSize="12px">
              {audioList?.length}
            </Text>
          </Flex>
          <Flex alignItems="center" gridGap="8px">
            <Box
              width="40px"
              height="40px"
              borderRadius="5px"
              backgroundImage={playingTrack?.artwork}
              bgSize="cover"
            />
            <Box minWidth="100px" className={styles.trackSong}>
              <Text
                onClick={() => {
                  history.push({
                    pathname: `/tracks/${playingTrack?.slug}`,
                    state: { isShowShareTrack: false },
                  });
                }}
                className={styles.textSongName}
              >
                {playingTrack?.title ? formatTitle(playingTrack?.title) : ''}
              </Text>
              <Text
                className={classNames(
                  styles.textSongName,
                  styles.textSongArtist,
                )}
                cursor="unset"
              >
                {playingTrack?.artist ? formatTitle(playingTrack?.artist) : ''}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Flex
          display={isLargerThan500 ? 'flex' : 'none'}
          className={styles.left}
          w="calc(100% - 530px)"
          alignItems="center"
          marginLeft="0.7em"
        >
          <Text
            className={styles.mbDisplayNone}
            fontSize="15px"
            color="#A6A6A6"
            id="current-time"
          >
            {formatTime(0)}
          </Text>
          <LoadingOverlay
            active={!waveSurfer}
            spinner
            style={{ width: '100%' }}
          >
            <Box className={styles.progressBarContent}>
              <Box className={styles.audioMain}>
                <Box className={styles.progressBar}>
                  <Box id="waveform" ref={waveformRef} />
                </Box>
              </Box>
            </Box>
          </LoadingOverlay>

          <Text
            className={styles.mbDisplayNone}
            fontSize="15px"
            color="#A6A6A6"
          >
            {formatTime(wavesurfer?.current?.getDuration() || 0)}
          </Text>
        </Flex>

        <Flex
          className={styles.right}
          alignItems="center"
          marginLeft="20px"
          gridGap="15px"
        >
          {/* {playingTrack && <AddTrackIntoPlaylistButon id={playingTrack?._id} />} */}

          {/* <Box
            className={styles.mbDisplayNone}
            backgroundColor="#E8E8E8"
            width="22px"
            height="22px"
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={onOpen}
          >
            <IconShare />
          </Box> */}

          {/* <ShareTrack
            track={playingTrack}
            isOpen={isShowModal}
            onClose={onClose}
          />
          <Box className={styles.mbDisplayNone}>
            <CleanButton isClean={playingTrack?.isClean} />
          </Box> */}

          <Box
            className={styles.mbDisplayNone}
            onClick={onVolumeChangeFaVolume}
            _hover={{ cursor: 'pointer' }}
          >
            {isVolume ? (
              <FaVolumeUp size="20px" color="#C5C5C5" />
            ) : (
              <FaVolumeMute size="20px" color="#C5C5C5" />
            )}
          </Box>
          <input
            className={classNames(styles.rangeVolume, styles.mbDisplayNone)}
            id="range-volume"
            type="range"
            min="0"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            value={isVolume ? volume : 0}
          />
          <GrClose
            cursor="pointer"
            size={isLargerThan500 ? '20px' : '15px'}
            filter="invert(1)"
            onClick={() => setIsAudioPlay(false)}
          />
        </Flex>
      </Flex>
      {isVideoPlaying && isShowVideoTrack && (
        <Box className={styles.containerVideoPlayer}>
          <video
            id="myVideo"
            width="100%"
            muted
            controls={false}
            height="100%"
            ref={videoRef}
            onLoadedMetadata={onLoadedMetadata}
          >
            <source src={playingTrack?.previewUrl} type="video/mp4" />
          </video>
          <button
            onClick={handleFullScreen}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            <FullScreen />
          </button>
        </Box>
      )}
    </Box>
  );
}
