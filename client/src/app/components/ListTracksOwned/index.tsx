import { Box, Text } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useUserDetail } from 'app/hooks/Community/userInfo';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useEffect, useRef } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Empty from '../Empty';
import TrackItem from '../TrackItem';
import TrackList from '../TrackList';
import { renderLoadingTracks, renderTrackListItem } from '../TrackUtils/track';
import './styles.scss';

interface ListTracksOwnedProps {
  refWidth?: any;
}

export function ListTracksOwned({ refWidth }: ListTracksOwnedProps) {
  const {
    tracks = [],
    onGetTracks,
    filter,
    currentPage,
    isLoadingMore,
    loaderMoreRef,
    handleShowAllTrack,
    removeToggleShowFilter,
    isShowAllTracks,
  } = useTracks();

  const { isLightMode } = useModeTheme();

  const { userDetails } = useUserDetail();

  const itemsRef = useRef<any>([]);

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  const renderTracks = () => {
    if (!currentPage) {
      return renderLoadingTracks(10);
    }
    if (!tracks.length) return <Empty />;

    const TrackContent = () =>
      tracks?.map((track, index) => (
        <TrackItem
          key={track.id}
          index={index + 1}
          refEye={el => (itemsRef.current[index] = el)}
          track={track}
          sort={filter?.sort}
        />
      ));

    return (
      <Box>
        {renderTrackListItem(TrackContent())}
        {isLoadingMore ? renderLoadingTracks(2) : <Box ref={loaderMoreRef} />}
      </Box>
    );
  };

  return (
    <Box>
      {refWidth && (
        <Box
          cursor="pointer"
          position="fixed"
          top="80px"
          zIndex="100"
          right={`${
            (window?.innerWidth - refWidth?.current?.offsetWidth + 6) / 2
          }px`}
          className="iconEye"
        >
          <Box onClick={() => handleShowAllTrack(itemsRef)}>
            {isShowAllTracks ? (
              <AiOutlineEyeInvisible fontSize="20px" color="red" />
            ) : (
              <AiOutlineEye
                fontSize="20px"
                className={isLightMode ? 'iconEyeInside' : ''}
                color="#fff"
              />
            )}
          </Box>
        </Box>
      )}

      {userDetails?.username && (
        <Text fontSize="38px" lineHeight="44px" mb="10px" fontWeight="bold">
          {userDetails?.username}'s Tracks Owned
        </Text>
      )}

      <TrackList
        children={renderTracks()}
        tracks={tracks}
        handleShowAllTrack={() => handleShowAllTrack(itemsRef)}
        isShowExpandedAll={false}
      />
    </Box>
  );
}
