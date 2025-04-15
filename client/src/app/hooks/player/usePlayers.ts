import { VIDEO } from 'app/constants';
import { usePlayerSlice } from 'app/pages/Tracks/playerAudio';
import { selectSliceAudio } from 'app/pages/Tracks/playerAudio/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { formatTime } from 'app/utils/date';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';

export const usePlayers = () => {
  const dispatch = useDispatch();

  const {
    playingTrack,
    isAudioPlay,
    playingTrackId,
    audioList,
    isPlaying,
    waveSurfer,
    isShowVideoTrack,
    waveSurferVideo,
    isLoadedSuccessVideoTrack,
    isUseInput,
  } = useSelector(selectSliceAudio);
  const { actions: playerActions } = usePlayerSlice();
  const { actions } = useTrackSlice();

  const [waveform, setWaveform] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenPlaylist, setIsOpenPlaylist] = useState<boolean>(false);
  const [durationTime, setDurationTime] = useState<number>(0);
  const [volume, setVolume] = useState(0.75);
  const [isVolume, setIsVolume] = useState(true);

  const waveformRef = useRef<any>(null);
  const wavesurfer = useRef<any>(null);
  const videoRef = useRef<any>(null);

  const formWaveSurferOptions = ref => ({
    barWidth: 1,
    cursorWidth: 1,
    container: ref,
    //option allows to hear the audio before the full waveform loads.
    // backend: 'MediaElement',
    height: 50,
    progressColor: '#31c27c',
    responsive: true,
    waveColor: '#A6A6A6',
    cursorColor: 'transparent',
  });

  const setPlayingTrack = useCallback(
    audio => {
      dispatch(playerActions.setPlayingTrack(audio));
    },
    [dispatch, playerActions],
  );

  const removeAudioList = useCallback(
    audio => {
      dispatch(playerActions.removeAudioList());
    },
    [dispatch, playerActions],
  );

  const handleAddAudio = useCallback(
    audio => {
      dispatch(playerActions.selectAudio(audio));
    },
    [dispatch, playerActions],
  );

  const setPlayingTrackId = useCallback(
    audio => {
      dispatch(playerActions.setPlayingTrackId(audio?._id));
    },
    [dispatch, playerActions],
  );

  const setIsAudioPlay = useCallback(
    boolean => {
      dispatch(playerActions.setIsAudioPlay(boolean));
    },
    [dispatch, playerActions],
  );

  const handlePlayOrPause = useCallback(
    track => {
      dispatch(playerActions.setWaveSurfer(null));
      dispatch(
        actions.togglePlayOrPause({
          trackID: track._id,
          isPlaying: !Boolean(track.isPlaying),
        }),
      );

      setPlayingTrack(track);
      setPlayingTrackId(track._id);
      setIsAudioPlay(true);
      const spotifyEmbedWindow: any = document.querySelector(
        'iframe[src*="spotify.com/embed"]',
      );
      if (spotifyEmbedWindow) {
        const message = spotifyEmbedWindow?.contentWindow;
        message?.postMessage({ command: 'pause' }, '*');
      }
    },
    [
      actions,
      dispatch,
      playerActions,
      setIsAudioPlay,
      setPlayingTrack,
      setPlayingTrackId,
    ],
  );

  const isVideoPlaying = useMemo(() => {
    return playingTrack?.type === VIDEO;
  }, [playingTrack?.type]);

  const handlePlayPause = useCallback(
    playingTrack => {
      if (!isLoadedSuccessVideoTrack && isVideoPlaying) return;
      dispatch(playerActions.setIsPlaying(!isPlaying));

      dispatch(
        actions.togglePlayOrPause({
          trackID: playingTrack._id,
          isPlaying: !isPlaying,
        }),
      );
      waveSurfer.playPause();
      if (isVideoPlaying) {
        if (isPlaying) {
          waveSurferVideo.pause();
        } else {
          waveSurferVideo.play();
        }
      }
      const spotifyEmbedWindow: any = document.querySelector(
        'iframe[src*="spotify.com/embed"]',
      );
      if (spotifyEmbedWindow) {
        const message = spotifyEmbedWindow?.contentWindow;
        message?.postMessage({ command: 'pause' }, '*');
      }
    },
    [
      actions,
      dispatch,
      isLoadedSuccessVideoTrack,
      isPlaying,
      isVideoPlaying,
      playerActions,
      waveSurfer,
      waveSurferVideo,
    ],
  );

  const onVolumeChange = useCallback(e => {
    setIsVolume(true);
    wavesurfer.current.setVolume(e.target.value);
    setVolume(e.target.value);
  }, []);
  const onVolumeChangeFaVolume = useCallback(
    e => {
      wavesurfer.current.setVolume(isVolume ? 0 : volume);
      setIsVolume(!isVolume);
    },
    [isVolume, volume],
  );

  const handleNextPrevious = useCallback(
    isNext => {
      const index = audioList.findIndex(
        track => track._id === playingTrack?._id,
      );

      if (audioList.length <= 1) {
        return;
      } else {
        handlePlayOrPause(
          isNext
            ? index > 0
              ? audioList[index - 1]
              : audioList[audioList.length - 1]
            : index < audioList.length - 1
            ? audioList[index + 1]
            : audioList[0],
        );
      }
    },
    [audioList, handlePlayOrPause, playingTrack?._id],
  );

  const onLoadedMetadata = useCallback(() => {
    dispatch(playerActions.setLoadedSuccessVideoTrack(true));
    dispatch(playerActions.setIsPlaying(true));
    wavesurfer.current.playPause();
    videoRef?.current.play();
    dispatch(playerActions.setWaveSurferVideo(videoRef.current));
  }, [dispatch, playerActions]);

  const handleFastForwardofRewind = useCallback(
    isFastForward => {
      const trackPlay = wavesurfer.current;
      const currentTime = trackPlay.getCurrentTime();
      const durationTrack = trackPlay.getDuration();

      if (isFastForward) {
        if (audioList.length > 1) {
          if (durationTrack - currentTime < 3) {
            handleNextPrevious(true);
          } else {
            trackPlay.setCurrentTime(currentTime + 5);
          }
        } else {
          trackPlay.setCurrentTime(currentTime + 5);
        }
      } else {
        if (currentTime < 5) {
          trackPlay.setCurrentTime(currentTime - currentTime);
        }
        trackPlay.setCurrentTime(currentTime - 5);
      }
    },
    [audioList, handleNextPrevious, wavesurfer],
  );

  const loadWaveform = useCallback(() => {
    const element = document.getElementById('current-time');
    if (element) {
      element.innerHTML = formatTime(0);
    }
    dispatch(playerActions.setIsPlaying(false));
    dispatch(playerActions.setShowVideoTrack(false));
    dispatch(playerActions.setLoadedSuccessVideoTrack(false));
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create({
      ...options,
      backend: 'MediaElement', // Thêm option này
      mediaControls: false, // Thêm option này cho mobile
    });
    // wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(playingTrack?.previewUrl);
    wavesurfer.current.on('ready', function () {
      if (wavesurfer.current) {
        dispatch(playerActions.setWaveSurfer(wavesurfer.current));
        wavesurfer.current.setVolume(isVolume ? volume : 0);
        if (isVideoPlaying) {
          dispatch(playerActions.setShowVideoTrack(true));
        } else {
          dispatch(playerActions.setIsPlaying(true));
          wavesurfer.current.playPause();
        }
      }
    });
    const alreadyTrack = audioList.find(
      track => track._id === playingTrack?._id,
    );
    if (!alreadyTrack) handleAddAudio(playingTrack);
    wavesurfer.current.on('audioprocess', () => {
      const element = document.getElementById('current-time');
      if (element) {
        element.innerHTML = formatTime(wavesurfer.current.getCurrentTime());
      }
      const elementTrackId = document.getElementById(playingTrack?._id || '');
      if (elementTrackId) {
        elementTrackId.style.width = `calc(${Number(
          (wavesurfer.current.getCurrentTime() /
            wavesurfer.current.getDuration()) *
            100,
        )}% - 2px)`;
      }

      const elementSliderId = document.getElementById(
        `slider${playingTrack?._id}` || '',
      ) as HTMLInputElement | null;

      if (elementSliderId != null) {
        elementSliderId.value = (
          (wavesurfer.current.getCurrentTime() /
            wavesurfer.current.getDuration()) *
          100
        ).toString();
      }
    });
    wavesurfer.current.on('seek', () => {
      const element = document.getElementById('current-time');
      if (element) {
        element.innerHTML = formatTime(wavesurfer.current.getCurrentTime());
      }

      const elementTrackId = document.getElementById(playingTrack?._id || '');
      if (elementTrackId) {
        elementTrackId.style.width = `calc(${Number(
          (wavesurfer.current.getCurrentTime() /
            wavesurfer.current.getDuration()) *
            100,
        )}% - 2px)`;
      }
      const elementSliderId = document.getElementById(
        `slider${playingTrack?._id}` || '',
      ) as HTMLInputElement | null;

      if (elementSliderId != null) {
        elementSliderId.value = (
          (wavesurfer.current.getCurrentTime() /
            wavesurfer.current.getDuration()) *
          100
        ).toString();
      }
      if (isVideoPlaying) {
        videoRef.current.currentTime = wavesurfer.current.getCurrentTime();
      }
    });
    wavesurfer.current.on('finish', () => {
      dispatch(playerActions.setIsPlaying(false));
      // if (audioList.length <= 1) {
      //   wavesurfer.current.seekTo(0);
      //   wavesurfer.current.playPause();
      //   dispatch(playerActions.setIsPlaying(false));
      //   setIsAudioPlay(false);
      // } else {
      //   let isFinish = true;
      //   handleNextPrevious(true, isFinish);
      // }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioList, handleAddAudio, handleNextPrevious]);

  const handleDeleteTrack = useCallback(
    trackId => {
      const filter = audioList.filter(track => track._id !== trackId);
      dispatch(playerActions.setAudioList(filter));
      if (filter.length === 0) return setIsAudioPlay(false);
      if (trackId === playingTrack?._id) handleNextPrevious(true);
    },
    [
      audioList,
      dispatch,
      handleNextPrevious,
      playerActions,
      playingTrack?._id,
      setIsAudioPlay,
    ],
  );

  const handleRelead = () => {
    wavesurfer.current.seekTo(0);
    wavesurfer.current.play();
    dispatch(playerActions.setIsPlaying(true));
  };

  const handleInputFocus = () => {
    dispatch(playerActions.setIsUseInput(true));
  };
  const handleInputBlur = () => {
    dispatch(playerActions.setIsUseInput(false));
  };

  return {
    handleInputFocus,
    handleInputBlur,
    handlePlayOrPause,
    handleRelead,
    handleFastForwardofRewind,
    isAudioPlay,
    setIsAudioPlay,
    playingTrack,
    setPlayingTrack,
    waveform,
    setWaveform,
    durationTime,
    setDurationTime,
    volume,
    setVolume,
    waveformRef,
    wavesurfer,
    isPlaying,
    handlePlayPause,
    onVolumeChange,
    loadWaveform,
    isOpen,
    setIsOpen,
    setPlayingTrackId,
    playingTrackId,
    isOpenPlaylist,
    setIsOpenPlaylist,
    audioList,
    removeAudioList,
    handleNextPrevious,
    handleDeleteTrack,
    waveSurfer,
    videoRef,
    isVideoPlaying,
    onLoadedMetadata,
    isShowVideoTrack,
    onVolumeChangeFaVolume,
    isVolume,
    isUseInput,
  };
};
