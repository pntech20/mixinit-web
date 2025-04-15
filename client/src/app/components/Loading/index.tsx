import { useGlobalUI } from 'app/hooks/global/useGlobalUI';
// import LogoCastdjLoading from '../LogoCastdjLoading';
import { Box, CircularProgress } from '@chakra-ui/react';
import styles from './index.module.scss';

interface Props {}

export const Loading: React.FC<Props> = () => {
  const { isLoading } = useGlobalUI();

  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.globalLoadingContainer}>
      {/* <LogoCastdjLoading /> */}
      <Box className={styles.icon}>
        <CircularProgress isIndeterminate size="80px" color="green.300" />
      </Box>
    </div>
  );
};
