import { Image } from '@chakra-ui/image';
import { Box } from '@chakra-ui/layout';
import TagOrder from 'app/components/TagOrder';
import { FunctionComponent } from 'react';
import './ImageRatio.scss';

interface ImageRatioProps {
  src: string;
  fallbacksrc: string;
  alt?: string;
  cursor?: string;
  onClick?: () => void;
  price?: any;
  onClickHeart?: any;
  isFeatured?: boolean;
  isButtonBottom?: any;
  createdAt?: any;
  totalTracks?: any;
  notElemLeftTop?: boolean;
  className?: string;
  index?: number;
}

const ImageRatio: FunctionComponent<ImageRatioProps> = ({
  fallbacksrc,
  src,
  alt,
  cursor,
  price,
  onClickHeart,
  isFeatured,
  isButtonBottom = false,
  totalTracks,
  createdAt,
  notElemLeftTop = false,
  onClick,
  className,
  index,
}: ImageRatioProps) => {
  return (
    <>
      <Box className={`img-ratio ${className}`}>
        <Box position="relative" paddingTop="100%">
          <Image
            objectFit="cover"
            w="100%"
            src={src}
            cursor={cursor}
            fallbacksrc={fallbacksrc}
            alt={alt}
            position="absolute"
            top="0"
            height="100%"
            onClick={onClick}
          />
        </Box>
      </Box>
      {index && <TagOrder className="index-label" content={`#${index}`} />}
      {isFeatured && (
        <Box
          width="20px"
          height="20px"
          backgroundColor="yellow"
          borderRadius="50%"
          textAlign="center"
          lineHeight="20px"
          fontSize="10px"
          bgColor="#ED7358"
          color="#fff"
          fontWeight="bold"
          ml="auto"
          mr="-6px"
          mt="-10px"
          zIndex="99"
          position="relative"
        >
          F
        </Box>
      )}
    </>
  );
};

export default ImageRatio;
