import { Box, SimpleGrid, Skeleton, Stack } from '@chakra-ui/react';
import { generateArray } from 'app/helpers/functions';
import SkeletonItem from '../SkeletonItem';
import TrackItemSkeleton from '../TrackItemSkeleton';
import Top10ListsSkeleton from '../Top10ListsSkeleton';

export const renderLoadingGridMode = () => (
  <Box mt="15px">
    <SimpleGrid
      gridGap="15px"
      columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
    >
      {generateArray(5).map(item => (
        <SkeletonItem borderRadius="10px" key={item} />
      ))}
    </SimpleGrid>
  </Box>
);

export const renderLoadingTracks = numberItem => {
  return (
    <Stack>
      {generateArray(numberItem).map(item => (
        <TrackItemSkeleton key={item} />
      ))}
    </Stack>
  );
};

export const renderLoadingTop10Lists = numberItem => {
  return (
    <SimpleGrid
      gap="20px"
      columns={{ base: 1, md: 4, lg: 5 }}
      alignItems="center"
      mt="20px"
    >
      {generateArray(numberItem).map(item => (
        <Top10ListsSkeleton key={item} />
      ))}
    </SimpleGrid>
  );
};

export const renderTrackGridItem = children => (
  <SimpleGrid gridGap="20px" columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }}>
    {children}
  </SimpleGrid>
);

export const renderTrackListItem = children => <Box>{children}</Box>;

export const renderBanner = () => (
  <Box mt="15px">
    <SimpleGrid columns={5}>
      {generateArray(5).map(item => (
        <SkeletonItem key={item} />
      ))}
    </SimpleGrid>
  </Box>
);

export const renderTable = numberItem => (
  <Box mt="15px">
    {generateArray(numberItem).map(() => (
      <Box borderBottom="1px solid #ccc">
        <Skeleton height="60px" />
      </Box>
    ))}
  </Box>
);
