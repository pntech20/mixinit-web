import {
  Box,
  Flex,
  Menu,
  Text,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from '@chakra-ui/slider';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';

interface FilterItemProps {
  name?: string;
  text: string;
  min: number;
  max: number;
  limit: number[];
  setLimit: (val) => void;
  onChangeSlider: (val, name) => void;
}

const SliderFilter = ({
  name,
  text,
  min,
  max,
  limit,
  setLimit,
  onChangeSlider,
}: FilterItemProps) => {
  const { textCommunityColor } = useModeTheme();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  return (
    <Box
      minW={isLargerThan768 ? '220px' : '310px'}
      className="filter-item"
      padding="5px"
      border="1px solid #ebe3e3"
      borderRadius="5px"
      w="100%"
    >
      <Menu closeOnSelect={false}>
        <Box width="100%">
          <Text
            fontSize="14px"
            fontWeight="600"
            color={textCommunityColor}
            pb="7px"
          >
            {text}
          </Text>
          <RangeSlider
            defaultValue={limit}
            value={limit}
            size="lg"
            min={min}
            max={max}
            step={1}
            width="calc(100% - 20px)"
            mx="10px"
            height="8px"
            cursor="pointer"
            onChange={val => {
              setLimit(val);
              onChangeSlider(val, name);
            }}
          >
            <RangeSliderTrack
              height="8px"
              borderRadius="10px"
              bg={useColorModeValue('#000', '#EFEFEF')}
            >
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb
              index={0}
              value={0}
              w="20px"
              h="8px"
              border="1px solid"
              borderRadius="10px"
              bg="#0082F3"
              fontWeight="400"
              fontSize="14px"
              sx={{
                ':focus': {
                  boxShadow: '0 0 3px #fff',
                },
              }}
            ></RangeSliderThumb>

            <RangeSliderThumb
              index={1}
              w="20px"
              h="8px"
              border="1px solid"
              borderRadius="10px"
              fontWeight="400"
              fontSize="14px"
              bg="#0082F3"
              sx={{
                ':focus': {
                  boxShadow: '0 0 3px #fff',
                },
              }}
            ></RangeSliderThumb>
          </RangeSlider>
        </Box>
      </Menu>
      <Flex justifyContent="space-between" mt="6px">
        <Text fontSize="12px">{limit[0]}</Text>
        <Text fontSize="12px">{limit[1]}</Text>
      </Flex>
    </Box>
  );
};

export default SliderFilter;
