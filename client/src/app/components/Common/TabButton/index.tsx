import { Tab, TabProps } from '@chakra-ui/react';
import classNames from 'classnames';
import styles from './tabButton.module.scss';

interface TabButtonProps extends TabProps {
  text: string;
  className?: string;
  isAccounting?: boolean;
}

export default function TabButton(props: TabButtonProps) {
  const { text, className, isAccounting = false } = props;

  return (
    <Tab
      border={{ base: '0.5px solid #e2e2e2', md: 'unset' }}
      _selected={{
        color: 'white',
        bg: isAccounting ? '#C20300' : '#5C94E8',
        border: 'none',
      }}
      mr={isAccounting ? '0px' : '10px'}
      className={classNames(styles.tabButtonContainer, className)}
      _hover={{
        background: isAccounting && '#C20300',
        color: isAccounting && '#FFFFFF',
      }}
      borderRadius={isAccounting ? '0px' : 'auto'}
    >
      {text}
    </Tab>
  );
}
