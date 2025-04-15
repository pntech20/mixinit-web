import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';
import classnames from 'classnames';
import { FunctionComponent } from 'react';
import styles from './wraperTrackItem.module.scss';

interface WrapperTrackItemProps {
  children: React.ReactNode;
}

const WrapperTrackItem: FunctionComponent<WrapperTrackItemProps> = ({
  children,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Box className={classnames(styles.wrapperTrackItem, styles[colorMode])}>
      {children}
    </Box>
  );
};

export default WrapperTrackItem;
