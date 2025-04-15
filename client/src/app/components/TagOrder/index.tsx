import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/react';
import classNames from 'classnames';
import styles from './index.module.scss';

interface TagOrderProps {
  content?: string | number;
  className?: string;
}

export default function TagOrder({ className = '', content }: TagOrderProps) {
  const { colorMode } = useColorMode();

  return (
    <Box
      className={classNames(
        styles.tagOrderWidget,
        styles[colorMode],
        className,
      )}
    >
      {content}
    </Box>
  );
}
