import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { DATE_RANGE } from 'app/constants/enum';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useCallback, useMemo } from 'react';
import ShowAllButton from '../ShowAllButton';

interface TimeSelectorProps {
  selectedTime: string | number;
  onChangeTime: (time: any) => void;
  isShowAllTracks?: boolean;
  isTop10ListsPage?: boolean;
  onShowAllTracks?: () => void;
  isBg?: any;
}

const TimeSelector = (props: TimeSelectorProps) => {
  const {
    isShowAllTracks = false,
    onShowAllTracks,
    selectedTime,
    onChangeTime,
    isTop10ListsPage = false,
    isBg,
  } = props;
  const { listTimeFrame = [], listTimeTop10Lists = [] } = useFilters();
  const [isLargerThan860] = useMediaQuery('(min-width: 860px)');
  const { colorMode } = useModeTheme();

  const handleChooseTime = useCallback(
    (time: any) => {
      onChangeTime(time?.value);
    },
    [onChangeTime],
  );

  const timeSelectedText = useMemo(() => {
    return selectedTime !== DATE_RANGE.ALL_TIME
      ? `Last ${selectedTime} Days`
      : 'All Time';
  }, [selectedTime]);

  const colorText = useColorModeValue('#616161', '#fff');

  return (
    <>
      {!isTop10ListsPage && (
        <Text fontSize="12px" fontWeight="600" color={colorText}>
          {timeSelectedText}
        </Text>
      )}

      <Flex
        mt="10px"
        pb="5px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex gridGap="5px" alignItems="center">
          {(isTop10ListsPage ? listTimeTop10Lists : listTimeFrame).map(time => {
            const getBackgroundColor = (isBg, isSelected, colorMode) => {
              if (isBg && isSelected) return isBg;
              if (isSelected) return colorMode === 'light' ? '#000' : '#fff';
              return colorMode === 'light' ? '#fff' : '#000';
            };

            const getColor = (isBg, isSelected, colorMode) => {
              if (isBg && isSelected) return '#fff';
              if (isSelected) return colorMode === 'light' ? '#fff' : '#000';
              return colorMode === 'light' ? '#000' : '#fff';
            };

            const isSelected = selectedTime === time.value;
            const bg = getBackgroundColor(isBg, isSelected, colorMode);
            const color = getColor(isBg, isSelected, colorMode);
            return (
              <Box
                key={time.value}
                onClick={() => handleChooseTime(time)}
                cursor="pointer"
                padding={isLargerThan860 ? '3px 10px' : '3px 8px'}
                style={{ backgroundColor: bg, color }}
                textAlign="center"
                fontWeight="600"
                border="0.4px solid #adadad"
                fontSize="10px"
                borderRadius="5px"
                whiteSpace="nowrap"
              >
                {time.name}
              </Box>
            );
          })}
        </Flex>

        {isShowAllTracks && <ShowAllButton onClick={onShowAllTracks} />}
      </Flex>
    </>
  );
};

export default TimeSelector;
