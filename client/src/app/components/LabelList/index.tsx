import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import IconRemoveOption from 'app/assets/svgs/IconRemoveOption';
import { generateArray } from 'app/helpers/functions';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useSections } from 'app/hooks/sections/useSections';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Empty from '../Empty';
import SearchFilter from '../FilterLabels/SearchFilter';
import LabelItem from '../LabelItem';
import SkeletonItem from '../SkeletonItem';

export function ItemFilter({ value = '', handleDelete }) {
  return (
    <Flex
      className="flex"
      alignItems="center"
      borderRadius="5px"
      border="0.4px solid #000000"
      p="5px 10px"
      mr="10px"
    >
      <IconRemoveOption onClick={handleDelete} />
      <Text ml="5px" fontSize="12px">
        {value}
      </Text>
    </Flex>
  );
}

const LabelList = () => {
  const {
    handleChangeFilter,
    handleChange,
    isLoading = false,
    onGetSections,
    filter,
    sections = [],
    onResetFilter,
    setSearchValue,
    setFilter,
    searchValue,
  } = useSections();
  const ref = useRef<any>(null);
  // const { isShowFilter, removeToggleShowFilter } = useTracks();
  // const { setIsScrollPastFilter, setIsNotScrollPastFilter, scrollValue } =
  //   useGeneral();
  const { sortByOptionsLabel } = useFilters();

  const location: any = useLocation();

  useEffect(() => {
    if (location.state?.search) {
      const search = location.state?.search;
      setSearchValue(search);
      setFilter(current => ({
        ...current,
        search: search,
      }));
    }
  }, [location.state?.search, setFilter, setSearchValue]);

  // useEffect(() => {
  //   if (location.state?.sortType) {
  //     const sortType = location.state?.sortType;
  //     setFilter(current => ({ ...current, sort: sortType, page: 1 }));
  //   }
  // }, [location.state?.sortType, setFilter, setSearchValue]);

  // useEffect(() => {
  //   return () => {
  //     removeToggleShowFilter();
  //   };
  // }, [removeToggleShowFilter]);

  useEffect(() => {
    onGetSections();
  }, [onGetSections]);

  const renderUILoadMore = useCallback(
    () => (
      <Box>
        <SimpleGrid gridGap="20px" columns={{ base: 1, sm: 2, lg: 5, xl: 5 }}>
          {generateArray(5).map(item => (
            <SkeletonItem
              isBanner={true}
              height="350px"
              borderRadius="10px"
              key={item}
            />
          ))}
        </SimpleGrid>
      </Box>
    ),
    [],
  );

  const renderLabel = useCallback(() => {
    if (isLoading) return renderUILoadMore();
    if (!sections?.length) return <Empty />;
    return (
      <Box>
        <SimpleGrid gridGap="20px" columns={{ base: 1, sm: 2, lg: 5, xl: 5 }}>
          {sections.map((item, index) => (
            <LabelItem width="100%" key={item._id} label={item} />
          ))}
        </SimpleGrid>
      </Box>
    );
  }, [isLoading, renderUILoadMore, sections]);

  // useEffect(() => {
  //   if (scrollValue < 50 && scrollValue !== 0) {
  //     setIsScrollPastFilter();
  //   } else if (scrollValue < 370 && isShowFilter) {
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

  const contentFilter = () => (
    <Box>
      <SearchFilter
        handleChange={handleChange}
        handleChangeFilter={handleChangeFilter}
        filter={filter}
        onReset={onResetFilter}
        sortBy={[
          { value: 'order@asc', label: 'Select' },
          ...sortByOptionsLabel,
        ]}
        searchValue={searchValue}
      />
    </Box>
  );

  return (
    <Box>
      {contentFilter()}

      <Box mt="30px" ref={ref}>
        {renderLabel()}
      </Box>
    </Box>
  );
};

export default LabelList;
