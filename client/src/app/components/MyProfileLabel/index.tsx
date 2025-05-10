import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import SkeletonItem from 'app/components/SkeletonItem';
import { generateArray } from 'app/helpers/functions';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useSections } from 'app/hooks/sections/useSections';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useCallback, useEffect } from 'react';
import Empty from '../Empty';
import LabelItem from '../LabelItem';
import SearchAndSort from '../SearchAndSort';

export function MyProfileLabel({ userDetails }: any) {
  const {
    handleChangeFilter,
    handleChange,
    isLoading = false,
    onGetSections,
    filter,
    sections = [],
    // onResetFilter,
    searchValue,
  } = useSections();

  const { removeToggleShowFilter } = useTracks();

  const { sortByOptionsLabel } = useFilters();

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  useEffect(() => {
    onGetSections();
  }, [onGetSections]);
  const renderUILoadMore = useCallback(
    () => (
      <Box mt="40px">
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
    if (sections.length === 0) return <Empty />;
    if (sections.length !== 0)
      return (
        <Box padding="20px 0 20px 0">
          <SimpleGrid gridGap="20px" columns={{ base: 1, sm: 2, lg: 5, xl: 5 }}>
            {sections.map((item, index) => (
              <LabelItem
                width="100%"
                key={item._id}
                label={item}
                isShowNumberContributor={false}
              />
            ))}
          </SimpleGrid>
        </Box>
      );
  }, [isLoading, renderUILoadMore, sections]);

  return (
    <>
      {userDetails?.username && (
        <Text
          fontSize="38px"
          lineHeight="44px"
          mb="10px"
          fontWeight="bold"
          color="white"
        >
          {userDetails?.username}'s Labels
        </Text>
      )}
      <SearchAndSort
        listSort={sortByOptionsLabel}
        searchValue={searchValue}
        handleChange={handleChange}
        valueSort={filter?.sort}
        handleChangeFilter={handleChangeFilter}
        placeHolder={'Search label name'}
      />

      {/* <Flex mt="20px" justifyContent="flex-end">
        <Box cursor="pointer" onClick={onResetFilter}>
          <IconReturn />
        </Box>
      </Flex> */}

      {renderLabel()}
    </>
  );
}
