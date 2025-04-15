import { Box, Flex } from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import TrackItem from 'app/components/TrackItem';
import {
  renderLoadingTracks,
  renderTrackListItem,
} from 'app/components/TrackUtils/track';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { Track } from 'app/models';
import { useRef } from 'react';
import { AiOutlineEye } from 'react-icons/ai';

interface RelateTracksProps {
  relatedTracks?: Track[];
}

export function RelatedTracks({ relatedTracks }: RelateTracksProps) {
  const itemsRef = useRef<any>([]);
  const { handleShowAllTrack } = useTracks();

  const TrackContent = () => {
    return (relatedTracks || []).map((track, index) => (
      <TrackItem
        key={track.id}
        index={index + 1}
        refEye={el => (itemsRef.current[index] = el)}
        track={track}
        isRelatedTracks
      />
    ));
  };

  return (
    <Box>
      {relatedTracks ? (
        relatedTracks.length > 0 ? (
          <>
            <Flex
              justifyContent={{ base: 'center', md: 'flex-end' }}
              alignItems="center"
              mb="20px"
            >
              <Box
                mr="5px"
                cursor="pointer"
                onClick={() => handleShowAllTrack(itemsRef)}
              >
                <AiOutlineEye fontSize="20px" />
              </Box>
            </Flex>
            {renderTrackListItem(TrackContent())}
          </>
        ) : (
          <Empty />
        )
      ) : (
        renderLoadingTracks(10)
      )}
    </Box>
  );
}
