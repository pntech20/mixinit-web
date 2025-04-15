import { Box, Flex, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { useCallback } from 'react';
import styles from './styles.module.scss';

export interface Tab {
  id: string;
  text: string;
  content?: JSX.Element;
  length?: number;
}

interface TabsProps {
  tabs: Array<Tab>;
  className?: string;
  tabSelected: string;
  setTabSelected: (e) => void;
}

export default function Tabs({
  tabs = [],
  className,
  tabSelected,
  setTabSelected,
}: TabsProps) {
  const handleClick = useCallback(
    tab => {
      setTabSelected(tab);
    },
    [setTabSelected],
  );

  return (
    <Flex className={classNames(styles.wTab)} w="100%">
      {tabs.map(item => (
        <Box
          id={item.id}
          key={item.id}
          className={classNames(styles.tab, {
            [styles.selected]: tabSelected === item.id,
          })}
          onClick={() => handleClick(item.id)}
          w="80px"
          h="35px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="2px"
          mr={{ base: '4%', xl: '10%' }}
        >
          <Text
            display="flex"
            fontSize="18px"
            alignItems="center"
            justifyContent="center"
          >
            {item.text}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}
