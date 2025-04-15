import { Flex } from '@chakra-ui/react';

export default function ButtonTop({
  handClickTop,
  id,
  selectedTime,
  idx,
  text,
  labelId,
  value,
}: any) {
  return (
    <Flex
      bg="#000"
      color="#fff"
      p={{ base: '7px 10px', sm: '10px 15px' }}
      alignItems="center"
      justifyContent="center"
      fontSize={{ base: '11px', sm: '12px' }}
      borderRadius="5px"
      fontWeight={500}
      lineHeight="12px"
      mr={{ base: '5px', sm: '10px' }}
      cursor="pointer"
      whiteSpace="nowrap"
      onClick={() => handClickTop(id, selectedTime, idx, value, labelId)}
    >
      {text}
    </Flex>
  );
}
