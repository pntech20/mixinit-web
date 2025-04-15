import { Box, Flex } from '@chakra-ui/react';
import { PRESS_KEY_TYPE } from 'app/constants/enum';
import { useKeyPress } from 'app/hooks/player/useKeyPress';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { Track } from 'app/models';
import { useEffect } from 'react';
import { AiOutlineEye } from 'react-icons/ai';

interface Props {
  tracks: Array<Track>;
  children: any;
  handleShowAllTrack?: () => void;
  isHomePage?: boolean;
  isShowExpandedAll?: boolean;
}

const TrackList = ({
  tracks = [],
  children,
  handleShowAllTrack,
  isHomePage = false,
  isShowExpandedAll = true,
}: Props) => {
  const { isAudioPlay, playingTrack, setPlayingTrackId, setPlayingTrack } =
    usePlayers();

  const ArrowUpPress = useKeyPress(PRESS_KEY_TYPE.ARROW_UP);
  const ArrowDownPress = useKeyPress(PRESS_KEY_TYPE.ARROW_DOWN);

  useEffect(() => {
    if (isAudioPlay && tracks?.length) {
      const index = tracks.findIndex(track => track._id === playingTrack?._id);

      if (index >= 0) {
        let position = index;
        if (ArrowUpPress) {
          if (index === 0) return;
          position = index - 1;
        }
        if (ArrowDownPress) {
          if (index === tracks?.length - 1) return;
          position = index + 1;
        }
        if (position >= 0) {
          // const trackEle = document.getElementById(
          //   `track_${tracks[position]?._id}`,
          // );
          // if (trackEle) {
          //   trackEle.scrollIntoView({
          //     behavior: 'smooth',
          //     block: 'center',
          //     inline: 'center',
          //   });
          // }
          setPlayingTrack(tracks[position]);
          setPlayingTrackId(tracks[position]?._id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ArrowDownPress,
    ArrowUpPress,
    isAudioPlay,
    setPlayingTrack,
    setPlayingTrackId,
    tracks,
  ]);

  return (
    <>
      {tracks.length !== 0 && !isHomePage && isShowExpandedAll && (
        <Flex justifyContent="flex-end" alignItems="center">
          <Box mr="5px" mb="5px" cursor="pointer" onClick={handleShowAllTrack}>
            {<AiOutlineEye fontSize="20px" />}
          </Box>
        </Flex>
      )}

      <Box>{children}</Box>
    </>
  );
};

export default TrackList;
