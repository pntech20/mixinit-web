import {
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import IconReturn from 'app/assets/svgs/IconReturn';
import FilterItem from 'app/components/FilterItem';
import SearchAndSort from 'app/components/SearchAndSort';
import { TracksAndPagination } from 'app/components/TracksAndPaganation';
import { SORT_TYPE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { memo, useEffect, useMemo, useRef } from 'react';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { FaFilter } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './styles.module.scss';
import DropDown from 'app/components/Common/Dropdowns';
import { useResultsPerPage } from 'app/hooks/resultsPerPage/useResultsPerPage';
import { useTracks } from 'app/hooks/tracks/useTracks';

export const TracksInLabel = memo(({ labelDetail }: any) => {
  const { perPageLocalStorage } = useResultsPerPage();
  const itemsRef = useRef<any>([]);
  const tracksHook = useTracks();

  const {
    tracks,
    onGetTracks,
    handleChangeFilter,
    handleChange,
    filter,
    currentPage,
    onClear,
    handleShowAllTrack,
    removeToggleShowFilter,
    searchValue,
    isShowAllTracks,
    totalPage,
    setFilter,
    isLoading,
    isShowFilterTrack,
    setIsShowFilterTrack,
    handleFilterCheckbox,
    sections,
    handleFilterBpmOrYear,
    onHandleClickItemTagGenre,
  } = tracksHook;
  const location: any = useLocation();
  const { filtersV1, sortByTrackOptionsV1 } = useFilters();
  const { isLargerThan860 } = useMediaScreen();
  const { isLargerThan865 } = useMediaScreen();
  const history = useHistory();

  const widthDropDown = useBreakpointValue({
    base: '100%',
    md: '132px',
    lg: '170px',
  });

  const sectionsOptions = useMemo(() => {
    return ([...sections] || [])
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(section => {
        return { label: section.name, value: String(section.slug) };
      });
  }, [sections]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, tracks.length);
  }, [tracks.length]);

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    if (labelDetail?.slug) {
      setFilter(current => ({
        ...current,
        labelId: labelDetail?.slug,
      }));
    }
  }, [labelDetail?.slug, setFilter]);

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  useEffect(() => {
    const { newRelease } = location.state || {};

    if (newRelease) {
      setFilter(current => ({
        ...current,
        sort: SORT_TYPE.PUBLISHED_AT_DESC,
        pageSize: perPageLocalStorage,
        page: 1,
      }));
      history.replace({
        ...location,
        state: undefined,
      });
    }
  }, [perPageLocalStorage, history, location, setFilter]);

  return (
    <Box>
      <Box>
        <Flex alignItems="center" gridGap="15px" mb="10px">
          <Image
            objectFit="cover"
            className={styles.listItemImage}
            src={labelDetail?.squareImageUrl}
          />
          <Box>
            {labelDetail?.name ? (
              <Text
                style={{
                  fontFamily:
                    'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, sans-serif',
                }}
                className={styles.content}
              >
                {labelDetail?.name}
              </Text>
            ) : (
              <Skeleton w="200px" h="32px" />
            )}
            <Text style={{ fontFamily: 'Exo, sans-serif' }} fontWeight={600}>
              TRACKS
            </Text>
          </Box>
        </Flex>
      </Box>
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
              history.push(`/labels/${value}?tab=1`);
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
          handleFilterCheckbox={handleFilterCheckbox}
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search title, artist of track'}
          mbSearch={{ md: isLargerThan865 ? '0px' : '18px' }}
          isShowCheckboxs
        />
        <Flex gridGap={{ base: '20px', md: '8px' }}>
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

      <Flex flexDirection={isLargerThan860 ? 'row' : 'column'} gridGap="30px">
        <Box width="100%">
          {isShowFilterTrack && (
            <Flex mb="8px">
              <FilterItem
                filterItems={filtersV1}
                onFilter={handleChangeFilter}
                onReset={onClear}
                filter={filter}
                setFilter={setFilter}
                isShowPageTrack
                handleFilterBpmOrYear={handleFilterBpmOrYear}
              />
            </Flex>
          )}
          <Flex
            alignItems="center"
            justify="flex-end"
            mb="8px"
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
            handleShowAllTrack={() => handleShowAllTrack(itemsRef)}
            isShowExpandedAll={false}
            currentPage={currentPage}
            itemsRef={itemsRef}
            isShowAllTracks={isShowAllTracks}
            totalPage={totalPage}
            isLoading={isLoading}
            onHandleClickItemTagGenre={onHandleClickItemTagGenre}
          />
        </Box>
      </Flex>
    </Box>
  );
});
