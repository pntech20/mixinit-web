import { FormLabel } from '@chakra-ui/react';
import classNames from 'classnames';
import styles from './index.module.scss';

interface LabelProps {
  label: string;
  className?: string;
}

export default function LabelForm({ label, className }: LabelProps) {
  return (
    <FormLabel className={classNames(styles.container, className)}>
      {label}
    </FormLabel>
  );
}
