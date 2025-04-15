import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { Dispatch, SetStateAction } from 'react';
import { useLocation } from 'react-router-dom';
interface Top10ItemProps {
  numberTrack?: number;
  numberRelease?: number;
  index?: number;
  name?: string;
  linkTo?: string;
  type: string;
  dateRange?: string | number;
  id?: string;
  individualName?: string;
  handleChangeFilter?: (event, key, type) => void;
  setIsShowFilterTrack?: Dispatch<SetStateAction<boolean>>;
}

const Top10Items = ({
  name,
  index = 1,
  type,
  id,
  handleChangeFilter,
  setIsShowFilterTrack,
}: Top10ItemProps) => {
  const { isLargerThan860, isLargerThan600 } = useMediaScreen();
  const { onHandleClickItemTagGenre } = useTracks();
  const { pathname } = useLocation();
  const isLabel = pathname.includes('/labels');

  const handleItemClick = () => {
    if (!isLabel) {
      onHandleClickItemTagGenre(type, {
        name,
        _id: id,
      });
      return;
    }
    if (handleChangeFilter && setIsShowFilterTrack) {
      handleChangeFilter([{ label: name, value: id }], type, 'dropdown');
      setIsShowFilterTrack(true);
    }
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      h="42px"
      padding="10px"
    >
      <Flex w="100%" alignItems="center">
        <Text
          textAlign="center"
          margin="auto"
          fontWeight="bold"
          fontSize="12px"
          minW="18px"
          align="center"
        >
          {index}
        </Text>
        <Text
          w={{ base: '100%', md: '180px' }}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontWeight="bold"
          fontSize="12px"
          p="0 0 0 10px"
          cursor="pointer"
          onClick={handleItemClick}
        >
          <Tooltip hasArrow label={name} aria-label="A tooltip">
            {name}
          </Tooltip>
        </Text>
      </Flex>
      <Flex w="40%" justifyContent="space-between">
        <Box
          w="50%"
          display={
            isLargerThan860 ? 'flex' : isLargerThan600 ? 'block' : 'flex'
          }
          alignItems="center"
        ></Box>
      </Flex>
    </Flex>
  );
};

export default Top10Items;
