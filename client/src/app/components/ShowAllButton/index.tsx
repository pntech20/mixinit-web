import { Box, Flex } from '@chakra-ui/react';
import { IoEyeSharp } from 'react-icons/io5';

interface Props {
  margin?: string;
  display?: string;
  onClick?: () => void;
}

export default function ShowAllButton({ margin, display, onClick }: Props) {
  return (
    <Flex
      cursor="pointer"
      h="25px"
      pr="5px"
      alignItems="center"
      bg="none"
      margin={margin}
      display={display}
      onClick={onClick}
    >
      <Box>
        <IoEyeSharp fontSize="20px" />
      </Box>
    </Flex>
  );
}
