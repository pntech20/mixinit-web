import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useEffect, useMemo } from 'react';
import DropDown from 'app/components/Common/Dropdowns';
import IconReturn from 'app/assets/svgs/IconReturn';
import { SORT_TYPE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { FaFilter } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { useHistory, useLocation } from 'react-router-dom';
import FilterItem from '../FilterItem';
import SearchAndSort from '../SearchAndSort';
import { TracksAndPagination } from '../TracksAndPaganation';
import { useResultsPerPage } from 'app/hooks/resultsPerPage/useResultsPerPage';

interface MyProfileTracksProps {
  refWidth?: any;
  userDetails?: any;
}

export function MyProfileTracks({
  refWidth,
  userDetails,
}: MyProfileTracksProps) {
  const { perPageLocalStorage } = useResultsPerPage();
  const {
    tracks = [],
    onGetTracks,
    filter,
    currentPage,
    handleChange,
    onClear,
    handleChangeFilter,
    handleShowAllTrack,
    removeToggleShowFilter,
    isShowAllTracks,
    searchValue,
    setFilter,
    totalPage,
    isLoading,
    itemsRef,
    isShowFilterTrack,
    setIsShowFilterTrack,
    sections,
    handleFilterCheckbox,
    onHandleClickItemTagGenre,
  } = useTracks();
  const history = useHistory();

  const widthDropDown = useBreakpointValue({
    base: '100%',
    md: '132px',
    lg: '170px',
  });

  const location: any = useLocation();

  const { filtersV1, sortByTrackOptionsV1 } = useFilters();

  const sectionsOptions = useMemo(() => {
    return [
      {
        label: 'All Labels',
        value: '',
      },
    ].concat(
      ([...sections] || [])
        .sort(function (a, b) {
          return a.name.localeCompare(b.name);
        })
        .map(section => {
          return { label: section.name, value: section.slug || '' };
        }),
    );
  }, [sections]);

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    const { labelId } = location.state || {};
    if (labelId) {
      const section = (sections || []).find(s => s._id === labelId);
      setIsShowFilterTrack(true);
      setFilter(current => ({
        ...current,
        showSections: [{ label: section?.name, value: section?._id }],
        page: 1,
      }));
    }
  }, [location.state, sections, setFilter, setIsShowFilterTrack]);

  useEffect(() => {
    const { dataRange, newRelease } = location.state || {};
    if (dataRange) {
      setFilter(current => ({
        ...current,
        sort: dataRange,
        pageSize: perPageLocalStorage,
        page: 1,
      }));
    }

    if (newRelease) {
      setFilter(current => ({
        ...current,
        sort: SORT_TYPE.PUBLISHED_AT_DESC,
        pageSize: perPageLocalStorage,
        page: 1,
      }));
    }
  }, [perPageLocalStorage, location.state, setFilter]);

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  return (
    <Box>
      {userDetails?.username && (
        <Text fontSize="38px" lineHeight="44px" mb="10px" fontWeight="bold">
          {userDetails?.username}'s Tracks
        </Text>
      )}
      <Flex
        gridGap="8px"
        justifyContent="space-between"
        alignItems="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Box w={{ base: '100%', md: 'unset' }}>
          <Text
            fontSize="12px"
            fontWeight="600"
            color={useColorModeValue('#616161', '#fff')}
          >
            Label:
          </Text>
          <DropDown
            width={widthDropDown}
            filters={sectionsOptions}
            value={filter?.labelId || ''}
            handleChangeDropDown={value => {
              // KUYZ%20J%20RUIZ
              history.push(
                `/contributors/${decodeURIComponent(
                  userDetails?.slug,
                )}?tab=1&label=${value}`,
              );
            }}
          />
        </Box>
        <SearchAndSort
          listSort={
            filter.search.length > 0
              ? [
                  {
                    label: 'Relevance',
                    value: '',
                  },
                  ...sortByTrackOptionsV1,
                ]
              : sortByTrackOptionsV1
          }
          searchValue={searchValue}
          handleChange={handleChange}
          valueSort={filter?.sort}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search title, artist of track'}
          handleFilterCheckbox={handleFilterCheckbox}
          filter={filter}
          isShowCheckboxs
        />
        <Flex gridGap={{ base: '20px', md: '8px' }} alignItems="center">
          <Flex
            mt="12px"
            cursor="pointer"
            onClick={() => setIsShowFilterTrack(!isShowFilterTrack)}
          >
            <FaFilter fontSize="20px" />
          </Flex>
          <Flex
            mt="12px"
            cursor="pointer"
            onClick={() => handleShowAllTrack(itemsRef)}
          >
            {isShowAllTracks ? (
              <BsFillEyeSlashFill fontSize="20px" />
            ) : (
              <IoEyeSharp fontSize="20px" />
            )}
          </Flex>
        </Flex>
      </Flex>

      {/* <FilterGenresTags
        genres={userDetails?.listGenresRelease || []}
        tags={userDetails?.listTagsRelease || []}
        handleChangeFilter={handleChangeFilter}
      /> */}

      {isShowFilterTrack && (
        <Flex mb="8px">
          <FilterItem
            filterItems={filtersV1}
            onFilter={handleChangeFilter}
            onReset={onClear}
            filter={filter}
            setFilter={setFilter}
            isShowPageTrack
          />
        </Flex>
      )}
      <Flex
        alignItems="center"
        justify="flex-end"
        my="8px"
        style={{ gap: '15px' }}
      >
        {isShowFilterTrack && (
          <Flex cursor="pointer" onClick={() => onClear()}>
            <IconReturn />
          </Flex>
        )}
      </Flex>
      <TracksAndPagination
        setFilter={setFilter}
        tracks={tracks}
        filter={filter}
        currentPage={currentPage}
        itemsRef={itemsRef}
        isShowAllTracks={isShowAllTracks}
        totalPage={totalPage}
        isLoading={isLoading}
        isShowExpandedAll={false}
        handleShowAllTrack={() => handleShowAllTrack(itemsRef)}
        onHandleClickItemTagGenre={onHandleClickItemTagGenre}
      />
    </Box>
  );
}
