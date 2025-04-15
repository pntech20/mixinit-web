import { Image } from '@chakra-ui/image';
import { Box } from '@chakra-ui/layout';
import styles from './communityAvatar.module.scss';

interface CommunityAvatarProps {
  src: string;
  fallbacksrc: string;
  alt?: string;
  cursor?: string;
  onClick?: () => void;
  className?: string;
}

const CommunityAvatar = ({
  fallbacksrc,
  src,
  alt,
  cursor,
  onClick,
  className,
}: CommunityAvatarProps) => {
  return (
    <Box className={styles.avatarRatio}>
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
          className={className}
        />
      </Box>
    </Box>
  );
};

export default CommunityAvatar;
