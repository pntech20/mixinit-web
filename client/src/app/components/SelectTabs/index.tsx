import { Box, Select } from '@chakra-ui/react';
import { useCallback } from 'react';

export interface Tab {
  _id: string;
  text: string;
  content?: JSX.Element;
}

interface TabsProps {
  tabs: Array<Tab>;
  className?: string;
  tabSelected: string;
  setTabSelected: (e) => void;
  setA: (i) => void;
}

export default function SelectTabs({
  tabs = [],
  className,
  tabSelected,
  setTabSelected,
  setA,
}: TabsProps) {
  const handleClick = useCallback(
    e => {
      setA(e.target.value);
    },
    [setA],
  );

  return (
    <Box w="100%">
      <Select
        bg="#ed7358"
        textColor="white"
        iconColor="white"
        onChange={handleClick}
        fontWeight="700"
      >
        {tabs.map((item, index) => (
          <option
            style={{ background: '#fff' }}
            id={item._id}
            key={item._id}
            selected={tabSelected === item._id}
          >
            {item.text}
          </option>
        ))}
      </Select>
    </Box>
  );
}
