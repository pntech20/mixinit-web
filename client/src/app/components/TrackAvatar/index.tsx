import { Box, Image, Flex } from '@chakra-ui/react';
import PlaceholderBgDefault from 'app/assets/placeholders/track-placeholder.svg';
import { usePlayers } from 'app/hooks/player/usePlayers';
import classNames from 'classnames';
import { useMemo } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import styles from './index.module.scss';

interface Props {
  avatar?: string;
  onClickPlayTrack?: () => void;
  trackId?: string;
  widthAvatar?: string;
  widthIconPlay?: string;
  top?: string;
  iconSize?: string;
}

export default function TrackAvatar(props: Props) {
  const {
    avatar,
    onClickPlayTrack,
    trackId,
    widthAvatar = '50px',
    widthIconPlay = '26px',
    // top = '7px',
    iconSize = '7px',
  } = props;
  const { playingTrack, isPlaying, handlePlayPause, isAudioPlay } =
    usePlayers();

  const isOwnerTrack = useMemo(() => {
    return playingTrack?._id === trackId;
  }, [playingTrack?._id, trackId]);

  const { pathname } = useLocation();

  const isTrackDetailPage = useMemo(() => {
    if (pathname.includes('/tracks/')) {
      return true;
    }
    return false;
  }, [pathname]);
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100%"
      position="relative"
      className={styles.trackAvatar}
    >
      <Box
        width={widthIconPlay}
        height={widthIconPlay}
        // top={top}
        // left={top}
        fontSize={iconSize}
        className={classNames(styles.iconPlay, styles.icon)}
        bg="#424242"
      >
        {isOwnerTrack && isPlaying ? (
          <FaPause
            fontSize={isTrackDetailPage ? '30px' : '13px'}
            onClick={() => {
              handlePlayPause(playingTrack);
            }}
          />
        ) : (
          <FaPlay
            fontSize={isTrackDetailPage ? '30px' : '13px'}
            onClick={() => {
              if (isOwnerTrack && isAudioPlay) {
                handlePlayPause(playingTrack);
              } else {
                onClickPlayTrack && onClickPlayTrack();
              }
            }}
          />
        )}
      </Box>
      <Image
        w={widthAvatar}
        h={widthAvatar}
        className={styles.imgTrack}
        fallbacksrc={PlaceholderBgDefault}
        src={avatar}
        alt="track"
        minW={widthAvatar}
      />
    </Flex>
  );
}
