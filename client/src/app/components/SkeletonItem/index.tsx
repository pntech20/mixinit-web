import { AspectRatio, Box, Skeleton, SkeletonText } from '@chakra-ui/react';
import './styles.scss';

interface Props {
  borderRadius?: string;
  height?: string;
  className?: string;
  noOfLines?: number;
  isShowFooter?: boolean;
  isBanner?: boolean;
}

const SkeletonItem = (props: Props) => {
  const {
    borderRadius = '',
    height = '220px',
    noOfLines = 5,
    isShowFooter = false,
    className,
    isBanner = false,
  } = props;

  return (
    <Box className={className}>
      {isBanner ? (
        <Skeleton height={height} borderRadius={borderRadius} />
      ) : (
        <AspectRatio ratio={1 / 1}>
          <Skeleton height={height} borderRadius={borderRadius} />
        </AspectRatio>
      )}

      {isShowFooter && (
        <Box>
          <SkeletonText mt="4" noOfLines={noOfLines} spacing="4" />
        </Box>
      )}
    </Box>
  );
};

export default SkeletonItem;
