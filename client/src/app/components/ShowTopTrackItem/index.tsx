import { Box } from '@chakra-ui/react';
import Empty from '../Empty';
import TrackItem from '../TrackItem';
import { TextTop100 } from '../TextTop100';

const ShowTopTrackItem = ({
  visibleTracksIndex,
  dataKey,
  loadingIndexes,
  itemData,
  renderLoadingTracks,
  updateWishlistStatus,
  handleOpenBuyTrackBySub,
  handleOpenBuyTrack,
  selectedTime,
  id,
  page,
  label = '',
}: any) => {
  if (!visibleTracksIndex[dataKey]) {
    return null;
  }

  return (
    <Box border="1px solid #bdbdbd" borderTop="0px" pb="5px">
      {loadingIndexes.includes(dataKey) ? (
        renderLoadingTracks(5)
      ) : (
        <>
          {itemData[dataKey].length === 0 && (
            <Box my="15px">
              <Empty />
            </Box>
          )}
          {itemData[dataKey].length > 0 && (
            <Box pt="10px">
              {itemData[dataKey].map((track, index) => (
                <TrackItem
                  track={track}
                  index={index + 1}
                  key={track._id}
                  updateWishlistStatus={updateWishlistStatus}
                  handleOpenBuyTrackBySub={handleOpenBuyTrackBySub}
                  handleOpenBuyTrack={handleOpenBuyTrack}
                  isChartsPage
                />
              ))}
            </Box>
          )}
          <TextTop100
            idOrSlug={id}
            selectedTime={selectedTime}
            page={page}
            label={label}
          />
        </>
      )}
    </Box>
  );
};

export default ShowTopTrackItem;
