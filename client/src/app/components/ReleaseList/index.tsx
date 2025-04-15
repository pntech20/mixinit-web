import { Box, Flex } from '@chakra-ui/react';
import IconReturn from 'app/assets/svgs/IconReturn';
import { INDIVIDUAL_PAGE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useGenres } from 'app/hooks/genres/useGenres';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTags } from 'app/hooks/tags/useTags';
import { Release } from 'app/models';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import FilterRelease from '../FilterRelease/FilterRelease';
import { ReleasesAndPagination } from '../ReleasesAndPagination';
import SearchAndSort from '../SearchAndSort';
import { FaFilter } from 'react-icons/fa';

interface Props {
  releases: Array<Release>;
  inMyMedia?: boolean;
}

const ReleaseList = ({ releases = [], inMyMedia = false }: Props) => {
  const ref = useRef<any>(null);
  const { search } = useLocation();

  const {
    onGetReleases,
    handleChangeFilter,
    handleChange,
    onResetFilter,
    filter,
    handleChangeCheckbox,
    isLoadingRelease,
    setFilter,
    currentPage,
    searchValue,
    setSearchValue,
    totalPage,
    isLoading,
    isShowFilterRelease,
    setIsShowFilterRelease,
  } = useReleases();

  const location: any = useLocation();

  useEffect(() => {
    const { sortType, search, listReleaseIds } = location.state || {};
    if (search) {
      setSearchValue(search);
      setFilter(current => ({
        ...current,
        title: search,
      }));
    }
    if (sortType) {
      setFilter(current => {
        return {
          ...current,
          sort: sortType,
          page: 1,
        };
      });
    }
    if (listReleaseIds) {
      setFilter(current => ({
        ...current,
        listReleaseIds: listReleaseIds,
        page: 1,
      }));
    }
  }, [location.state, search, setFilter, setSearchValue]);

  // const { setIsScrollPastFilter, setIsNotScrollPastFilter, scrollValue } =
  //   useGeneral();

  // const { isShowFilter, removeToggleShowFilter, setShowFilter } = useTracks();

  const { filtersReleases, sortByOptions } = useFilters();

  useEffect(() => {
    onGetReleases();
  }, [onGetReleases, isLoadingRelease]);

  // useEffect(() => {
  //   return () => {
  //     removeToggleShowFilter();
  //   };
  // }, [removeToggleShowFilter]);

  // useEffect(() => {
  //   if (scrollValue < 50 && scrollValue !== 0) {
  //     setIsScrollPastFilter();
  //   } else if (scrollValue < 270 && isShowFilter) {
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

  useEffect(() => {
    if (location.state?.dateRange) {
      const {
        id,
        name,
        dateRange,
        type,
        individualName,
        individualType,
        individualData,
      } = location.state;

      const valueFilter = {
        label: name,
        value: id,
      };

      setFilter(current => ({
        ...current,
        [type]: [valueFilter],
        dateRange,
        [individualType === INDIVIDUAL_PAGE.LABEL
          ? 'showSections'
          : 'showContributors']: individualType
          ? [
              {
                label: individualName,
                value: individualData,
              },
            ]
          : null,
      }));
    }
  }, [location.state, location.state?.dateRange, setFilter]);

  const { genres } = useGenres();
  const { tags } = useTags();

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  // useEffect(() => {
  //   if (location.state?.type) {
  //     setShowFilter();
  //     setIsShowFilterRelease(true);
  //     const { label, value, type } = location.state;
  //     setFilter(current => ({
  //       ...current,
  //       [type]: [
  //         {
  //           label,
  //           value,
  //         },
  //       ],
  //     }));
  //     history.replace({
  //       ...location,
  //       state: undefined,
  //     });
  //   }
  // }, [
  //   location.state,
  //   setFilter,
  //   setShowFilter,
  //   setIsShowFilterRelease,
  //   location,
  //   history,
  // ]);

  return (
    <>
      <Flex
        gridGap="8px"
        justifyContent="space-between"
        alignItems={{ base: 'unset', md: 'center' }}
      >
        <SearchAndSort
          listSort={sortByOptions}
          searchValue={searchValue}
          handleChange={handleChange}
          valueSort={filter?.sort}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search title, artist of tracks inside multipack'}
          filter={filter}
          isMultipacks
        />
        <Flex
          mt={{ base: '44px', sm: '28px', md: '12px' }}
          cursor="pointer"
          onClick={() => setIsShowFilterRelease(!isShowFilterRelease)}
        >
          <FaFilter fontSize="20px" />
        </Flex>
      </Flex>

      {isShowFilterRelease && (
        <>
          <Flex>
            <FilterRelease
              handleChange={handleChange}
              handleChangeFilter={handleChangeFilter}
              handleChangeCheckbox={handleChangeCheckbox}
              filters={filtersReleases}
              onReset={onResetFilter}
              filter={filter}
              genres={genres}
              tags={tags}
              searchValue={searchValue}
              isShowPageRelease
            />
          </Flex>
          <Flex justify="flex-end">
            <Box cursor="pointer" onClick={onResetFilter}>
              <IconReturn />
            </Box>
          </Flex>
        </>
      )}
      <Box mt="20px" ref={ref}>
        <ReleasesAndPagination
          setFilter={setFilter}
          releases={releases}
          filter={filter}
          currentPage={currentPage}
          totalPage={totalPage}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
};

export default ReleaseList;
