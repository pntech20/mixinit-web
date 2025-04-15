import { Flex, Text } from '@chakra-ui/react';
import { TiDelete } from 'react-icons/ti';

interface Props {
  value: string;
  handleDelete?: any;
  isGenre?: boolean;
}

export function ItemTagGenre({
  value = '',
  handleDelete,
  isGenre = false,
}: Props) {
  return (
    <Flex
      display="inline-flex"
      alignItems="center"
      bgColor={isGenre ? '#294f79' : '#963737'}
      color="white"
      borderRadius="5px"
      p="0px"
      pr="5px"
      pl="1px"
      h="25px"
    >
      <Text as="span" cursor="pointer" onClick={handleDelete}>
        <TiDelete fontSize="27.33px" color="#fff" />
      </Text>
      <Text fontSize="12px" fontWeight={600}>
        {value}
      </Text>
    </Flex>
  );
}
