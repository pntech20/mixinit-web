import { Grid, GridItem, Skeleton, SkeletonText } from '@chakra-ui/react';

const TrackItemSkeleton = () => {
  return (
    <Grid
      h="60px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(8, 1fr)"
      gap={2}
      mt="20px"
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Skeleton height="55px" />
      </GridItem>
      <GridItem colSpan={6}>
        <SkeletonText noOfLines={3} />
      </GridItem>
      <GridItem rowSpan={2} colSpan={1}>
        <Skeleton height="55px" />
      </GridItem>
    </Grid>
  );
};

export default TrackItemSkeleton;
