import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
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
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DropDown from '../Common/Dropdowns';
import Pagination from '../Pagination';
import SearchAndSort from '../SearchAndSort';
import styles from './styles.module.scss';
import { Ads } from '../Ads';
import { BannerListLabel } from '../BannerListLabel';
import Crate from '../Crate';
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
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
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

  // useEffect(() => {
  //   if (scrollValue < 50 && scrollValue !== 0) {
  //     setIsScrollPastFilter();
  //   } else if (scrollValue < 220 && isShowFilter) {
  //     setIsScrollPastFilter();
  //   } else {
  //     setIsNotScrollPastFilter();
  //   }
  // }, [
  //   isShowFilter,
  //   scrollValue,
  //   setIsNotScrollPastFilter,
  //   setIsScrollPastFilter,
  // ]);

  return (
    <>
      <HelmetPage title="Contributors" />
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      {pageHeader?.contributor && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.contributor)}
        </Box>
      )}
      <Flex
        alignContent="center"
        alignItems="center"
        gridGap="12px"
        flexWrap={{ base: 'wrap', md: 'unset' }}
      >
        <Flex gridGap="12px" alignItems="center">
          <Box>
            <Text
              fontSize="12px"
              fontWeight="600"
              color={useColorModeValue('#616161', '#fff')}
            >
              Label:
            </Text>
            <DropDown
              width="170px"
              value={filter.labelId}
              filters={sectionsOptions}
              handleChangeDropDown={value =>
                handleChangeFilter(value, 'labelId')
              }
            />
          </Box>
        </Flex>
        <SearchAndSort
          listSort={listOptionsSortByCommunity}
          searchValue={searchValue}
          handleChange={handleChange}
          valueSort={filter?.sort}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search username of contributor'}
        />
      </Flex>
      <Box ref={ref} mt="20px">
        {renderContent()}
        <Pagination totalPage={totalPage} setFilter={setFilter} />
      </Box>
    </>
  );
}
