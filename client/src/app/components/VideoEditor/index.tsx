import { Button, Spinner } from '@chakra-ui/react';
import { useVideoEditor } from 'app/hooks/uploader/useVideoEditor';
import React, { useEffect, useRef } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import { useTranslation } from 'react-i18next';
import useResizeObserver from 'use-resize-observer';
import './style.scss';
import { secondsToMinutes } from './usecases';

const VideoEditor = ({ src, passTimeSelected, isCutting }) => {
  const { t } = useTranslation();
  const videoRef = useRef<any>(null);

  const {
    pauseVideo,
    toggleVideo,
    handleSetVideoCurrentTime,
    videoCurrentTime,
    videoLength,
    setVideoLength,
    controlBarLeftOffset,
    setControlBarLeftOffset,
    controlBarRightOffset,
    setControlBarRightOffset,
  } = useVideoEditor(videoRef, src);

  const videoNavigationProps = {
    src,
    pauseVideo,
    videoCurrentTime,
    handleSetVideoCurrentTime,
    videoLength,
    setVideoLength,
    controlBarLeftOffset,
    controlBarRightOffset,
    setControlBarLeftOffset,
    setControlBarRightOffset,
    videoRef,
  };
  return (
    <div className="Video" style={{ padding: '0 15px' }}>
      <video ref={videoRef} src={src} width="100%" />

      <ReactCursorPosition>
        <VideoNavigation {...videoNavigationProps} />
      </ReactCursorPosition>

      <div className="block-bottom">
        <div className="block-controls">
          <Button
            onClick={toggleVideo}
            bg="#5c94e8"
            _hover={{
              backgroundColor: '#5c94e8',
            }}
          >
            {videoRef.current && videoRef.current.paused ? 'Play' : 'Pause'}
          </Button>

          <div className="text-align-center">
            <Button
              bg="#5c94e8"
              _hover={{
                backgroundColor: '#5c94e8',
              }}
              onClick={() => {
                passTimeSelected({
                  startTime: (controlBarLeftOffset / 100) * videoLength,
                  endTime: ((100 - controlBarRightOffset) / 100) * videoLength,
                  file: src,
                });
              }}
              disabled={isCutting}
            >
              {isCutting ? <Spinner /> : t('uploader.saveSnippet')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoNavigation = props => {
  const {
    src,
    videoCurrentTime,
    handleSetVideoCurrentTime,
    videoLength,
    controlBarLeftOffset,
    controlBarRightOffset,
    setControlBarLeftOffset,
    setControlBarRightOffset,
    pauseVideo,
    position: { x = 0 },
    videoRef,
  } = props;

  const {
    // videoFrames,
    // setVideoFrames,
    // videoFrameLoading,
    // setVideoFrameLoading,
    setOffsetLeft,
    isMovingCB,
    isVisible,
    isLeftCBActive,
    // frameNumbers,
    // setFrameNumbers,
    handleMouseLeave,
    handleControlBarsMouseDown,
    handleControlBarsMouseLeave,
    handleControlBarsMouseUp,
    setIsVisible,
    offsetLeft,
  } = useVideoEditor(videoRef, src);

  const { ref, width = 1 } = useResizeObserver();

  const handleMouseMove = e => {
    if (x >= 0 && x <= width && !isMovingCB) {
      const percent = (x / width) * 100;
      setOffsetLeft(percent);
      setIsVisible(true);
    }
  };

  useEffect(() => {
    const validPosition = x >= 0 && x <= width;

    if (validPosition && isMovingCB && isLeftCBActive) {
      setControlBarLeftOffset((x / width) * 100);
      handleSetVideoCurrentTime((x / width) * videoLength);
    }

    if (validPosition && isMovingCB && !isLeftCBActive) {
      setControlBarRightOffset(((width - x) / width) * 100);
      handleSetVideoCurrentTime((x / width) * videoLength);
    }
  }, [
    x,
    isMovingCB,
    width,
    isLeftCBActive,
    handleSetVideoCurrentTime,
    videoLength,
    setControlBarRightOffset,
    setControlBarLeftOffset,
  ]);

  // useEffect(() => {
  //   const reloadFrames = async () => {
  //     setVideoFrameLoading(true);
  //     const numbers = Math.ceil(width / SCALE.WIDTH);
  //     setFrameNumbers(numbers);
  //     const avgVideoSeconds = getAvgVideoSeconds(videoLength, numbers);

  //     const frames: any = await getFrames(src, avgVideoSeconds);
  //     setVideoFrames(frames);
  //     setVideoFrameLoading(false);
  //   };

  //   reloadFrames();
  // }, [
  //   videoLength,
  //   width,
  //   src,
  //   setFrameNumbers,
  //   setVideoFrameLoading,
  //   setVideoFrames,
  // ]);

  useEffect(() => {
    const maxVideoTime = ((100 - controlBarRightOffset) / 100) * videoLength;
    if (videoCurrentTime >= maxVideoTime && !isMovingCB) {
      pauseVideo();
      handleSetVideoCurrentTime((controlBarLeftOffset / 100) * videoLength);
    }
  }, [
    videoCurrentTime,
    controlBarLeftOffset,
    controlBarRightOffset,
    videoLength,
    isMovingCB,
    handleSetVideoCurrentTime,
    pauseVideo,
  ]);

  return (
    <>
      <div
        ref={ref}
        className="video-navigation"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="story-board">
          <div className="frames">
            {/* {videoFrameLoading &&
              [...Array(frameNumbers)].map((item, index) => (
                <div className="frame" key={index} />
              ))}
            {!videoFrameLoading &&
              videoFrames.map((imgSrc, key) => (
                <div key={key}>
                  <img src={imgSrc} alt="" />
                </div>
              ))} */}
          </div>
        </div>
        <div className="control-bars">
          <div
            className="progress-output"
            style={{ left: `${(videoCurrentTime / videoLength) * 100}%` }}
          >
            <div
              className="progress-line"
              data-value={secondsToMinutes(videoCurrentTime)}
            />
          </div>
          <div
            className="control-bars-wrapper"
            onMouseUp={handleControlBarsMouseUp}
            onMouseLeave={handleControlBarsMouseLeave}
          >
            <div
              className="control-bar cb-left"
              style={{ left: `${controlBarLeftOffset}%` }}
              data-content={secondsToMinutes(
                (controlBarLeftOffset / 100) * videoLength,
              )}
              onMouseDown={() => handleControlBarsMouseDown(true)}
            />
            <div
              className="control-bar cb-right"
              style={{ right: `${controlBarRightOffset}%` }}
              data-content={secondsToMinutes(
                ((100 - controlBarRightOffset) / 100) * videoLength,
              )}
              onMouseDown={() => handleControlBarsMouseDown(false)}
            />
          </div>
        </div>
        <div
          className="time-stripe"
          data-value={secondsToMinutes((offsetLeft / 100) * videoLength)}
          style={{
            left: `${offsetLeft}%`,
            visibility: isVisible && !isMovingCB ? 'visible' : 'hidden',
          }}
        />
      </div>
    </>
  );
};

const VideoEditorContainer = ({ src, passTimeSelected, isCutting }) => {
  const props = {
    src,
    // file,
    passTimeSelected,
    isCutting,
  };
  return <VideoEditor {...props} />;
};

export default VideoEditorContainer;
