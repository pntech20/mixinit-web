import { Box, GridItem, Image, Skeleton } from '@chakra-ui/react';
import ImageBanner from 'app/assets/banners/official-top-10-list.png';
import { renderLoadingTracks } from '../TrackUtils/track';

const Top10ListsSkeleton = () => {
  return (
    <Box minH="400px" p="5px" border="1px solid #ddd4d4" borderRadius="5px">
      <Box background="#000" borderRadius="50%" w="100%">
        <Image src={ImageBanner} h="auto" />
      </Box>
      <GridItem rowSpan={2} colSpan={1}>
        <Skeleton my="25px" height="55px" />
      </GridItem>
      {renderLoadingTracks(3)}
    </Box>
  );
};

export default Top10ListsSkeleton;
