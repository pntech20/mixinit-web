import { Grid, GridItem, Skeleton, SkeletonText } from '@chakra-ui/react';

interface Props {
  borderRadius?: string;
  height?: string;
  noOfLines?: number;
}

const SkeletonTopItem = (props: Props) => {
  const { borderRadius = '', height = '45px', noOfLines = 1 } = props;

  return (
    <Grid
      h="45px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(8, 1fr)"
      gap={2}
      mb="15px"
    >
      <GridItem rowSpan={2} colSpan={2}>
        <Skeleton height={height} borderRadius={borderRadius} />
      </GridItem>
      <GridItem colSpan={6} mt="2">
        <SkeletonText noOfLines={noOfLines} />
      </GridItem>
      <GridItem colSpan={2}>
        <SkeletonText noOfLines={noOfLines} />
      </GridItem>
      <GridItem colSpan={2}>
        <SkeletonText noOfLines={noOfLines} />
      </GridItem>
      <GridItem colSpan={2}>
        <SkeletonText noOfLines={noOfLines} />
      </GridItem>
    </Grid>
  );
};

export default SkeletonTopItem;
