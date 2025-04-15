import { Box } from '@chakra-ui/react';
import IconShare from 'app/assets/svgs/IconShare';
import styles from './shareButton.module.scss';

export default function ShareButton() {
  return (
    <Box padding="0 14px 0 14px">
      <Box className={styles.shareButton}>
        <IconShare />
      </Box>
    </Box>
  );
}
