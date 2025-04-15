import { getVideoLength } from 'app/components/VideoEditor/usecases';
import { useCallback, useState } from 'react';
import { useOnMount } from './useOnMount';

export const useVideoEditor = (videoRef, src) => {
  let intervalId;
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoLength, setVideoLength] = useState(0);
  const [controlBarLeftOffset, setControlBarLeftOffset] = useState(0.0);
  const [controlBarRightOffset, setControlBarRightOffset] = useState(0.0);
  const [isMovingCB, setMovingCB] = useState(false);
  const [videoFrames, setVideoFrames] = useState([]);
  const [videoFrameLoading, setVideoFrameLoading] = useState(true);
  const [offsetLeft, setOffsetLeft] = useState(0.0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeftCBActive, setLeftCBActive] = useState(true);
  const [frameNumbers, setFrameNumbers] = useState(0);

  const handleSetVideoCurrentTime = useCallback(
    time => {
      videoRef.current.currentTime = time;
      setVideoCurrentTime(time);
    },
    [videoRef],
  );

  const playVideo = () => {
    videoRef.current?.play();

    intervalId = setInterval(() => {
      setVideoCurrentTime(videoRef.current?.currentTime);
    }, 100);
  };

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause();
    clearInterval(intervalId);
  }, [intervalId, videoRef]);

  const toggleVideo = () => {
    videoRef.current.paused ? playVideo() : pauseVideo();
  };

  useOnMount(async () => {
    const videoDuration = await getVideoLength(src);
    setVideoLength(videoDuration);
  });

  const handleMouseLeave = e => {
    setIsVisible(false);
  };

  const handleControlBarsMouseDown = isLeft => {
    setMovingCB(true);
    setLeftCBActive(isLeft);
  };

  const handleClick = useCallback(() => {
    const videoTime = (offsetLeft / 100) * videoLength;
    const offsetRight = 100 - offsetLeft;
    handleSetVideoCurrentTime(videoTime);

    if (offsetLeft < controlBarLeftOffset) {
      setControlBarLeftOffset(offsetLeft);
    }

    if (offsetRight < controlBarRightOffset) {
      setControlBarRightOffset(offsetRight);
    }
  }, [
    offsetLeft,
    controlBarLeftOffset,
    controlBarRightOffset,
    videoLength,
    handleSetVideoCurrentTime,
    setControlBarLeftOffset,
    setControlBarRightOffset,
  ]);

  const handleControlBarsMouseUp = useCallback(
    e => {
      if (isMovingCB) {
        setMovingCB(false);
      } else {
        handleClick();
      }
    },
    [isMovingCB, handleClick],
  );

  const handleControlBarsMouseLeave = useCallback(
    e => {
      if (isMovingCB) {
        setMovingCB(false);
      }
    },
    [isMovingCB],
  );

  return {
    pauseVideo,
    playVideo,
    toggleVideo,
    handleSetVideoCurrentTime,
    videoCurrentTime,
    setVideoCurrentTime,
    videoLength,
    setVideoLength,
    controlBarLeftOffset,
    setControlBarLeftOffset,
    controlBarRightOffset,
    setControlBarRightOffset,
    videoRef,

    isMovingCB,
    videoFrames,
    setVideoFrames,
    videoFrameLoading,
    setVideoFrameLoading,
    setOffsetLeft,
    isVisible,
    isLeftCBActive,
    frameNumbers,
    setFrameNumbers,
    handleMouseLeave,
    handleControlBarsMouseDown,
    handleControlBarsMouseLeave,
    handleControlBarsMouseUp,
    setIsVisible,
    offsetLeft,
  };
};
