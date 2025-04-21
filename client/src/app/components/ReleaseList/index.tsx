import { Box, Flex } from '@chakra-ui/react';
import { INDIVIDUAL_PAGE } from 'app/constants/enum';
import { useGenres } from 'app/hooks/genres/useGenres';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTags } from 'app/hooks/tags/useTags';
import { Release } from 'app/models';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ReleasesAndPagination } from '../ReleasesAndPagination';

interface Props {
  releases: Array<Release>;
  inMyMedia?: boolean;
}

const ReleaseList = ({ releases = [], inMyMedia = false }: Props) => {
  const ref = useRef<any>(null);
  const { search } = useLocation();

  const {
    onGetReleases,
    filter,
    isLoadingRelease,
    setFilter,
    currentPage,
    setSearchValue,
    totalPage,
    isLoading,
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

  useEffect(() => {
    onGetReleases();
  }, [onGetReleases, isLoadingRelease]);

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

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  return (
    <>
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
