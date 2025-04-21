import { Box, Flex, SimpleGrid, Text, Image } from '@chakra-ui/react';
import logoIconBlack from 'app/assets/logo/MIXINIT2.png';

import CommunityItem from 'app/components/Community';
import Empty from 'app/components/Empty';
import { HelmetPage } from 'app/components/HelmetPage';
import SkeletonItem from 'app/components/SkeletonItem';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { generateArray } from 'app/helpers/functions';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useSections } from 'app/hooks/sections/useSections';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from '../Pagination';
import styles from './styles.module.scss';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

export function CommunityPage() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const { isLargerThan992 } = useMediaScreen();
  const { sections = [] } = useSections();
  const ref = useRef<any>(null);
  const {
    users,
    onGetCommunity,
    handleChange,
    handleChangeFilter,
    searchValue,
    setSearchValue,
    setFilter,
    filter,
    totalPage,
    isLoading,
  } = useCommunity();
  const { listOptionsSortByCommunity } = useFilters();

  const newUsers = (users || []).filter(
    user => user?._id !== '66e8627caf0a44ca6052e391',
  );

  // const { isShowFilter, removeToggleShowFilter } = useTracks();
  // const { setIsScrollPastFilter, setIsNotScrollPastFilter, scrollValue } =
  //   useGeneral();

  const location: any = useLocation();

  const sectionsOptions = useMemo(() => {
    return [
      {
        label: 'All Labels',
        value: 'all',
      },
    ].concat(
      ([...sections] || [])
        .sort(function (a, b) {
          return a.name.localeCompare(b.name);
        })
        .map(section => {
          return { label: section.name, value: section._id };
        }),
    );
  }, [sections]);

  useEffect(() => {
    if (location.state?.search) {
      const search = location.state?.search;
      setSearchValue(search);
      setFilter(current => ({
        ...current,
        search: search,
        page: 1,
      }));
    }
  }, [location.state?.search, setFilter, setSearchValue]);

  useEffect(() => {
    onGetCommunity();
  }, [onGetCommunity]);

  // useEffect(() => {
  //   return () => {
  //     removeToggleShowFilter();
  //   };
  // }, [removeToggleShowFilter]);

  const renderUILoadMore = useCallback(
    numberItem => (
      <SimpleGrid
        gridGap="10px"
        rowGap="10px"
        columns={{ base: 1, sm: 2, md: 4, lg: 4, xl: 5 }}
      >
        {generateArray(numberItem).map(item => (
          <SkeletonItem
            borderRadius="10px"
            className={styles.loadingContributor}
            height="100%"
            key={item}
          />
        ))}
      </SimpleGrid>
    ),
    [],
  );

  const renderContent = useCallback(() => {
    if (isLoading) return renderUILoadMore(10);
    if (!newUsers.length) return <Empty />;

    return (
      <Box mb="15px">
        <SimpleGrid
          mt="25px"
          gridGap="10px"
          rowGap="10px"
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        >
          {newUsers.map((item, idx) => (
            <CommunityItem
              key={item._id}
              user={item}
              labelId={filter?.labelId}
            />
          ))}
        </SimpleGrid>
      </Box>
    );
  }, [isLoading, renderUILoadMore, newUsers, filter?.labelId]);

  return (
    <>
      <Box ref={ref} mt="20px">
        <Flex alignItems="center" paddingBottom={'20px'}>
          <Image
            h="250px"
            color="#747474"
            src={logoIconBlack}
            ml="16px"
            borderRight="5px solid #6f747d"
            padding={'10px'}
            marginRight={'10px'}
          />
          <Box>
            <Text
              color="white"
              fontSize={'38px'}
              fontWeight={'bold'}
              textTransform={'uppercase'}
            >
              CONTRIBUTORS
            </Text>
            <Text color="white" fontSize={'18px'} fontWeight={'600'}>
              Our world-class contributors are second to none in DJ supply.
              Click on one to see what they have to offer!
            </Text>
          </Box>
        </Flex>
        {renderContent()}
        <Pagination totalPage={totalPage} setFilter={setFilter} />
      </Box>
    </>
  );
}
