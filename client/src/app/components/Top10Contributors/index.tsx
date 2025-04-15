import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { DATE_RANGE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
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
import Top10ContributorItem from './Top10ContributorItem';
import styles from './contributor.module.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useSections } from 'app/hooks/sections/useSections';

interface Top10ContributorsProps {
  labelId?: string;
  labelName?: string;
  handleChangeFilter?: (event, key, type) => void;
  setTabIndex?: Dispatch<SetStateAction<number>>;
  labelDetail?: any;
  setIsShowFilterTrack?: Dispatch<SetStateAction<boolean>>;
}

export default function Top10Contributors({
  labelId = 'all',
  labelName = '',
  handleChangeFilter,
  setTabIndex,
  labelDetail,
  setIsShowFilterTrack,
}: Top10ContributorsProps) {
  const { colorMode } = useModeTheme();
  const [selectedTime, setSelectedTime] = useState(DATE_RANGE.LAST_30_DAYS);
  const { listTimeFrame } = useFilters();
  const history = useHistory();
  const {
    topContributors,
    isLoadingTopContributor,
    onGetTopCommunity,
    topContributorsCache,
    updateTopContributor,
  } = useCommunity();
  const { sections } = useSections();
  const { pathname, search } = useLocation();
  const isLabel = pathname.includes('/labels');
  const queryParams = new URLSearchParams(search);
  const tabValue = queryParams.get('tab');

  const [isLargerThan860] = useMediaQuery('(min-width: 860px)');
  const borderColor = useColorModeValue('#dfdfdf', '#a8a6a6');

  const handleCheckContributor = useCallback(
    cacheKey => {
      return topContributorsCache[cacheKey];
    },
    [topContributorsCache],
  );

  useEffect(() => {
    const cacheKey = `${selectedTime}_${labelId}`;
    if (handleCheckContributor(cacheKey)) {
      updateTopContributor(handleCheckContributor(cacheKey));
    } else {
      onGetTopCommunity({ sort: String(selectedTime), labelId });
    }
  }, [
    labelId,
    updateTopContributor,
    onGetTopCommunity,
    selectedTime,
    handleCheckContributor,
  ]);

  const handleViewAll = useCallback(() => {
    return history.push({
      pathname: `/contributors`,
      search: `?sort=${String(selectedTime)}&labelId=${labelId}`,
    });
  }, [history, labelId, selectedTime]);

  const label = sections.find(section => section._id === labelId);

  const handleViewAllLabel = () => {
    if (setTabIndex && tabValue !== '3') {
      setTabIndex(3);
      history.push({
        pathname: `/labels/${labelDetail?.slug}`,
        search: `?tab=${3}`,
      });
    }
  };

  const handleClickViewAll = () => {
    isLabel ? handleViewAllLabel() : handleViewAll();
  };

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
        <Flex alignItems="center" gridGap="10px">
          <Text fontSize="20px" fontWeight="bold">
            Top Contributors
          </Text>
        </Flex>
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
                setSelectedTime(time.value);
              }}
            >
              {time.name}
            </Box>
          ))}
        </Flex>
      </Box>
      <Box>
        {isLoadingTopContributor ? (
          <Box padding="10px" textAlign="center">
            <SkeletonTopItem />
            <SkeletonTopItem />
          </Box>
        ) : topContributors.length ? (
          (topContributors || [])
            .filter(
              topContributor =>
                topContributor?._id !== '66e8627caf0a44ca6052e391',
            )
            .map((item, idx) => (
              <Top10ContributorItem
                key={idx}
                index={idx + 1}
                user={item}
                handleChangeFilter={handleChangeFilter}
                labelDetail={labelDetail}
                setTabIndex={setTabIndex}
                setIsShowFilterTrack={setIsShowFilterTrack}
              />
            ))
        ) : (
          <Box padding="5px">
            <Empty />
          </Box>
        )}
      </Box>
      {!isLoadingTopContributor && (
        <Text
          cursor="pointer"
          ml="5px"
          color="#0268dd"
          fontSize="13px"
          fontWeight="400"
          textDecoration="underline"
          onClick={handleClickViewAll}
        >
          View All
        </Text>
      )}
    </Box>
  );
}
