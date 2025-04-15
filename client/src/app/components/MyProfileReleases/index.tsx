import { Flex, Text } from '@chakra-ui/react';
import IconReturn from 'app/assets/svgs/IconReturn';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useGenres } from 'app/hooks/genres/useGenres';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTags } from 'app/hooks/tags/useTags';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useEffect } from 'react';
import FilterRelease from '../FilterRelease/FilterRelease';
import { ReleasesAndPagination } from '../ReleasesAndPagination';
import SearchAndSort from '../SearchAndSort';
import { FaFilter } from 'react-icons/fa';

interface MyProfileReleasesProps {
  refWidth?: any;
  userDetails?: any;
}

export function MyProfileReleases({
  refWidth,
  userDetails,
}: MyProfileReleasesProps) {
  const {
    onGetReleases,
    handleChangeFilter,
    handleChange,
    onResetFilter,
    filter,
    handleChangeCheckbox,
    isLoadingRelease,
    releases,
    currentPage,
    searchValue,
    totalPage,
    isLoading,
    setFilter,
    isShowFilterRelease,
    setIsShowFilterRelease,
  } = useReleases();
  const { removeToggleShowFilter } = useTracks();
  const { filtersReleases, sortByOptions } = useFilters();

  const { genres } = useGenres();
  const { tags } = useTags();

  useEffect(() => {
    onGetReleases();
  }, [onGetReleases, isLoadingRelease]);

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  return (
    <>
      {userDetails?.username && (
        <Text fontSize="38px" lineHeight="44px" mb="10px" fontWeight="bold">
          {userDetails?.username}'s Multipacks
        </Text>
      )}
      {/* <FilterGenresTags
        genres={userDetails?.listGenresRelease || []}
        tags={userDetails?.listTagsRelease || []}
        handleChangeFilter={handleChangeFilter}
        isReleases
      /> */}
      <Flex gridGap="8px" direction={{ base: 'column', md: 'row' }}>
        <SearchAndSort
          listSort={sortByOptions}
          searchValue={searchValue}
          handleChange={handleChange}
          valueSort={filter?.sort}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search title, artist of tracks inside multipack'}
        />
        <Flex
          mt={{ base: '8px', md: '25px' }}
          cursor="pointer"
          mx={{ base: 'auto', md: 'unset' }}
          onClick={() => setIsShowFilterRelease(!isShowFilterRelease)}
        >
          <FaFilter fontSize="20px" />
        </Flex>
      </Flex>

      {isShowFilterRelease && (
        <Flex mb="8px">
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
      )}
      <Flex
        alignItems="center"
        justify="flex-end"
        mt="12px"
        mb="8px"
        style={{ gap: '15px' }}
      >
        {isShowFilterRelease && (
          <Flex cursor="pointer" onClick={onResetFilter}>
            <IconReturn />
          </Flex>
        )}
      </Flex>
      <ReleasesAndPagination
        setFilter={setFilter}
        releases={releases}
        filter={filter}
        currentPage={currentPage}
        totalPage={totalPage}
        isLoading={isLoading}
      />
    </>
  );
}
