import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { getTopGenres } from 'app/apis/genres';
import { DATE_RANGE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import classnames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useModeTheme } from '../../hooks/ColorDarkMode/useModeTheme';
import Empty from '../Empty';
import SkeletonTopItem from '../SkeletonTopItem';
import Top10Items from '../Top10Items';
import styles from './genre.module.scss';
import { useSections } from 'app/hooks/sections/useSections';
import { useGenres } from 'app/hooks/genres/useGenres';

interface Query {
  dateRange?: number;
  labelId?: string;
}
export default function Top10Genres({
  labelId = '',
  handleChangeFilter,
  setIsShowFilterTrack,
}: any) {
  const { isLargerThan860 } = useMediaScreen();
  const { textColor, colorMode } = useModeTheme();
  const [selectedTime, setSelectedTime] = useState<any>(
    DATE_RANGE.LAST_30_DAYS,
  );
  const [dataGenres, setDataGenres] = useState<any>(null);
  const { listTimeFrame } = useFilters();
  const { sections } = useSections();
  const { onTopGenres, topGenres } = useGenres();

  const handleCheckGenre = useCallback(
    cacheKey => {
      return topGenres[cacheKey];
    },
    [topGenres],
  );

  const getDataGenres = useCallback(async () => {
    let query: Query = {
      dateRange: selectedTime,
      labelId,
    };
    const cacheKey = `${selectedTime}_${labelId}`;
    if (handleCheckGenre(cacheKey)) {
      setDataGenres(handleCheckGenre(cacheKey));
    } else {
      const res = await getTopGenres(query);
      setDataGenres(res);
      onTopGenres({
        cacheKey,
        data: res,
      });
    }
  }, [handleCheckGenre, labelId, onTopGenres, selectedTime]);

  useEffect(() => {
    getDataGenres();
  }, [getDataGenres]);

  const borderColor = useColorModeValue('#dfdfdf', '#a8a6a6');
  const borderBottomColor = useColorModeValue('#dfdfdf', '#9c9393');
  const label = sections.find(section => section._id === labelId);

  return (
    <Box
      mb="15px"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="5px"
      bg={useColorModeValue('#f5f5f5', '')}
    >
      <Box padding="10px">
        {label && (
          <Text fontSize="20px" fontWeight="bold" color="#002fff">
            {label?.name}
          </Text>
        )}
        <Text
          color={textColor}
          fontWeight="bold"
          fontSize="20px"
          lineHeight="25px"
        >
          Top Genres
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
              className={classnames({
                [styles[`selectedTime${colorMode}`]]:
                  selectedTime === time.value,
              })}
              textAlign="center"
              fontWeight="600"
              border="0.4px solid #adadad"
              fontSize="12px"
              borderRadius="5px"
              display="flex"
              alignItems="center"
              onClick={() => {
                String(time.value) !== String(selectedTime) &&
                  setDataGenres(null);
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
        {dataGenres ? (
          dataGenres.length ? (
            (dataGenres || []).map((item, idx) => (
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
                  numberTrack={item.totalTracks}
                  numberRelease={item.totalReleases}
                  linkTo={`/genres?type=genres&id=${item._id}`}
                  type="showGenres"
                  dateRange={selectedTime}
                  id={item._id}
                  handleChangeFilter={handleChangeFilter}
                  setIsShowFilterTrack={setIsShowFilterTrack}
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
