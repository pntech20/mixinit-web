import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import Empty from '../Empty';
import TimeSelector from '../TimeSelector';
import TrackItem from '../TrackItem';
import TrackList from '../TrackList';
import { renderLoadingTracks, renderTrackListItem } from '../TrackUtils/track';

const TopTracks = ({
  contributorId,
  labelId,
}: {
  contributorId?: string;
  labelId?: string;
}) => {
  const { textColor } = useModeTheme();
  const history = useHistory();
  const itemsRef = useRef<any>([]);

  const {
    onGetTracks,
    isLoading,
    handleShowAllTrack,
    tracks,
    filter,
    setFilter,
  } = useTracks();

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, tracks.length);
  }, [tracks.length]);

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  const renderTracks = () => {
    if (isLoading) {
      return renderLoadingTracks(5);
    }
    if (!tracks.length) return <Empty />;

    const TrackContent = () =>
      (tracks || []).map((track, index) => (
        <Box key={track._id}>
          <TrackItem
            index={index + 1}
            refEye={el => (itemsRef.current[index] = el)}
            track={track}
          />
        </Box>
      ));

    return <>{renderTrackListItem(TrackContent())}</>;
  };

  const handleViewAll = useCallback(() => {
    return history.push({
      pathname: `/tracks`,
      state: {
        sortType: filter.sort,
        contributorId,
        labelId,
      },
    });
  }, [history, filter.sort, contributorId, labelId]);

  const borderColor = useColorModeValue('#dfdfdf', '#a8a6a6');

  return (
    <Box border="1px solid" borderColor={borderColor} borderRadius="5px">
      <Box bg={useColorModeValue('#f5f5f5', '')} pl="5px" mb="10px">
        <Flex alignItems="center" gridGap="10px">
          <Text color={textColor} fontSize="20px" fontWeight="bold">
            Top Tracks
          </Text>
          <Text
            cursor="pointer"
            color="#0268dd"
            fontSize="13px"
            fontWeight="400"
            textDecoration="underline"
            onClick={handleViewAll}
          >
            View All
          </Text>
        </Flex>

        <TimeSelector
          isShowAllTracks={tracks?.length > 0 || false}
          selectedTime={
            filter.sort === 'all' ? filter.sort : Number(filter.sort)
          }
          onChangeTime={value => {
            setFilter(current => {
              return {
                ...current,
                sort: String(value),
                pageSize: 20,
              };
            });
          }}
          onShowAllTracks={() => handleShowAllTrack(itemsRef)}
        />
      </Box>

      <TrackList
        children={renderTracks()}
        tracks={tracks}
        handleShowAllTrack={() => handleShowAllTrack(itemsRef)}
        isHomePage
      />

      {!isLoading && (
        <Text
          ml="5px"
          cursor="pointer"
          color="#0268dd"
          fontSize="13px"
          fontWeight="400"
          textDecoration="underline"
          onClick={handleViewAll}
        >
          View All
        </Text>
      )}
    </Box>
  );
};

export default TopTracks;
