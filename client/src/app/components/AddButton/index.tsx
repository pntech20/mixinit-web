import { Box } from '@chakra-ui/react';
import IconAdd from 'app/assets/svgs/IconAdd';
import classnames from 'classnames';
import styles from './addButton.module.scss';

interface AddButtonProps {
  ismobile?: boolean;
  onClick?: (e) => void;
  className?: string;
}

export default function AddButton(props: AddButtonProps) {
  const { ismobile, onClick, className } = props;

  return (
    <Box className={styles.addButton} cursor="pointer" onClick={onClick}>
      <IconAdd
        className={classnames(styles.addIconButton, className, {
          [styles.addIconPlayMobile]: ismobile,
        })}
      />
    </Box>
  );
}
