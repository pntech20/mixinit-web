import { Tab } from '@chakra-ui/tabs';
import { FunctionComponent } from 'react';

interface SubTabButtonProps {
  text: string;
}

const SubTabButton: FunctionComponent<SubTabButtonProps> = ({ text }) => {
  return (
    <Tab
      fontSize="14px"
      fontWeight="600"
      lineHeight="18px"
      _selected={{
        borderBottom: '2px  solid #5C94E8',
        color: '#5C94E8',
        boxShadow: 'none',
        cursor: 'default',
      }}
    >
      {text}
    </Tab>
  );
};

export default SubTabButton;
