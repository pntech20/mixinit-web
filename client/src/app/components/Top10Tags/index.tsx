import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { getTopTags } from 'app/apis/tags';
import { DATE_RANGE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import classnames from 'classnames';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useModeTheme } from '../../hooks/ColorDarkMode/useModeTheme';
import Empty from '../Empty';
import SkeletonTopItem from '../SkeletonTopItem';
import Top10Items from '../Top10Items';
import styles from './tag.module.scss';
import { useSections } from 'app/hooks/sections/useSections';
import { useTags } from 'app/hooks/tags/useTags';

interface Top10TagsProps {
  labelName?: string;
  labelId?: string;
  handleChangeFilter?: (event, key, type) => void;
  setIsShowFilterTrack?: Dispatch<SetStateAction<boolean>>;
}

export default function Top10Tags({
  labelName = '',
  labelId = '',
  handleChangeFilter,
  setIsShowFilterTrack,
}: Top10TagsProps) {
  const { textColor, colorMode } = useModeTheme();
  const [selectedTime, setSelectedTime] = useState(DATE_RANGE.LAST_30_DAYS);
  const [dataTags, setDataTags] = useState<any>(null);
  const { listTimeFrame } = useFilters();
  const { sections } = useSections();
  const { isLargerThan860 } = useMediaScreen();
  const borderBottomColor = useColorModeValue('#dfdfdf', '#9c9393');
  const { onTopTags, topTags } = useTags();

  const handleCheckGenre = useCallback(
    cacheKey => {
      return topTags[cacheKey];
    },
    [topTags],
  );

  const getDataTags = useCallback(async () => {
    const query: any = {
      dateRange: selectedTime,
      labelId,
    };
    const cacheKey = `${selectedTime}_${labelId}`;

    if (handleCheckGenre(cacheKey)) {
      setDataTags(handleCheckGenre(cacheKey));
    } else {
      const res = await getTopTags(query);
      setDataTags(res);
      onTopTags({
        cacheKey,
        data: res,
      });
    }
  }, [handleCheckGenre, labelId, onTopTags, selectedTime]);

  const label = sections.find(section => section._id === labelId);

  useEffect(() => {
    getDataTags();
  }, [getDataTags]);

  return (
    <Box
      mb="15px"
      border="1px solid"
      borderColor={useColorModeValue('#dfdfdf', '#9c9393')}
      borderRadius="5px"
      bg={useColorModeValue('#f5f5f5', '')}
    >
      <Box padding="10px">
        {label && (
          <Text fontSize="20px" fontWeight="bold" color="#002fff">
            {label?.name}
          </Text>
        )}
        <Text color={textColor} fontSize="20px" fontWeight="bold">
          Top Tags
        </Text>
        <Text
          fontSize="12px"
          fontWeight="600"
          color={useColorModeValue('#616161', '#fff')}
        >
          {selectedTime !== DATE_RANGE.ALL_TIME
            ? `Last ${selectedTime} Days`
            : 'All Time'}
        </Text>
        <Flex
          gridGap={{ md: '5px', base: '10px', lg: '10px', xl: '10px' }}
          mt="10px"
        >
          {listTimeFrame.map(time => (
            <Box
              key={time.value}
              cursor="pointer"
              padding={isLargerThan860 ? '3px 10px' : '3px 8px'}
              fontSize="12px"
              className={classnames({
                [styles[`selectedTime${colorMode}`]]:
                  selectedTime === time.value,
              })}
              textAlign="center"
              fontWeight="600"
              border="0.4px solid #adadad"
              borderRadius="5px"
              display="flex"
              alignItems="center"
              onClick={() => {
                String(time.value) !== String(selectedTime) &&
                  setDataTags(null);
                String(time.value) !== String(selectedTime) &&
                  setSelectedTime(time.value);
              }}
            >
              {time.name}
            </Box>
          ))}
        </Flex>
      </Box>
      <Box>
        {dataTags ? (
          dataTags.length ? (
            (dataTags || []).map((item, idx) => (
              <Box
                key={idx}
                borderBottom="0.2px solid"
                borderBottomColor={borderBottomColor}
                sx={{
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <Top10Items
                  index={idx + 1}
                  name={item.name}
                  type="showTags"
                  id={item._id}
                  setIsShowFilterTrack={setIsShowFilterTrack}
                  handleChangeFilter={handleChangeFilter}
                />
              </Box>
            ))
          ) : (
            <Box padding="5px">
              <Empty />
            </Box>
          )
        ) : (
          <Box padding="10px" textAlign="center">
            <SkeletonTopItem />
            <SkeletonTopItem />
          </Box>
        )}
      </Box>
    </Box>
  );
}
