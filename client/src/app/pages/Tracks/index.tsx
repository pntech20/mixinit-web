import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import IconReturn from 'app/assets/svgs/IconReturn';
import DropDown from 'app/components/Common/Dropdowns';
import FilterItem from 'app/components/FilterItem';
import { HelmetPage } from 'app/components/HelmetPage';
import SearchAndSort from 'app/components/SearchAndSort';
import Top10Contributors from 'app/components/Top10Contributors';
import Top10Genres from 'app/components/Top10Genres';
import Top10Tags from 'app/components/Top10Tags';
import { TracksAndPagination } from 'app/components/TracksAndPaganation';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { getLocalStorage } from 'app/helpers/local-storage';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useCrates } from 'app/hooks/Crates/useCrate';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { isEmpty } from 'ramda';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { FaFilter } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useCratesSlice } from '../PageCrate/slice';
import { selectSliceCrates } from '../PageCrate/slice/selector';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';

export const Tracks = memo(() => {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const { filterRules } = useSelector(selectSliceCrates);
  const { isLargerThan1280, isLargerThan992 } = useMediaScreen();
  const widthDropDown = useBreakpointValue({
    base: '100%',
    md: '132px',
    lg: '170px',
  });
  localStorage.removeItem('subApp');
  localStorage.removeItem('services');
  const location: any = useLocation();
  const { sortByTrackOptionsV1, filtersV1 } = useFilters();
  const { setNameCrate } = useCrates();
  const ref = useRef<any>(null);
  const {
    setSearchValue,
    onGetTracks,
    handleChange,
    setFilter,
    onClear,
    handleShowAllTrack,
    handleChangeFilter,
    setShowFilter,
    tracks = [],
    filter,
    currentPage,
    itemsRef,
    isShowAllTracks,
    searchValue,
    sections,
    contributors,
    isShowFilterTrack,
    setIsShowFilterTrack,
    totalPage,
    isLoading,
    initialFilter,
    handleFilterCheckbox,
    handleFilterBpmOrYear,
    range,
    onHandleClickItemTagGenre,
    updateUrlWithFilters,
  } = useTracks();

  // const { setIsScrollPastFilter, setIsNotScrollPastFilter, scrollValue } =
  //   useGeneral();
  // const { filterTrack } = useSelector(selectSliceTracks);
  // const searchParams = new URLSearchParams(location.search);
  // const isFilter: any = searchParams.get('isFilter');
  const { playingTrack, handlePlayPause, isUseInput } = usePlayers();
  const { handleAddTrackToWishlist, isCheckOpenModelAddTrackToCart } =
    useWishlists();

  const { actions } = useCratesSlice();
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isShowMessageAddStorage = getLocalStorage('isShowMessageAdd');
  const isShowMessageAdd = isEmpty(isShowMessageAddStorage)
    ? true
    : isShowMessageAddStorage;

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
          return { label: section.name, value: section._id };
        }),
    );
  }, [sections]);

  const handleOncloseModelAddCart = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyPress = useCallback(
    event => {
      const { key } = event;
      if (!isUseInput) {
        if (
          ['Backspace'].includes(key) &&
          playingTrack &&
          !playingTrack.boughtByMe
        ) {
          isOpen &&
            !playingTrack.isBelongMyWishlist &&
            handleOncloseModelAddCart();
        }
        if (
          ['Enter'].includes(key) &&
          playingTrack &&
          !playingTrack.boughtByMe
        ) {
          if (
            !playingTrack.isBelongMyWishlist &&
            !isCheckOpenModelAddTrackToCart
          ) {
            if (!isOpen && isShowMessageAdd) {
              onOpen();
            } else {
              handleAddTrackToWishlist(playingTrack._id);
              handleOncloseModelAddCart();
            }
          }
        }
        if ([' '].includes(key) && playingTrack) {
          event.preventDefault();
          handlePlayPause(playingTrack);
        }
      }
    },
    [
      handleAddTrackToWishlist,
      handleOncloseModelAddCart,
      handlePlayPause,
      isCheckOpenModelAddTrackToCart,
      isOpen,
      isShowMessageAdd,
      isUseInput,
      onOpen,
      playingTrack,
    ],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    const { sortType, contributorId, labelId, search, listTrackIds } =
      location.state || {};

    if (sortType) {
      if (contributorId) {
        const contributor = (contributors || []).find(
          s => s._id === contributorId,
        );
        setIsShowFilterTrack(true);
        setFilter(current => ({
          ...current,
          sort: sortType,
          showContributors: [
            { label: contributor?.username, value: contributor?._id },
          ],
          page: 1,
        }));
      } else if (labelId) {
        const section = (sections || []).find(s => s._id === labelId);
        setIsShowFilterTrack(true);
        setFilter(current => ({
          ...current,
          sort: sortType,
          showSections: [{ label: section?.name, value: section?._id }],
          labelId,
          page: 1,
        }));
      } else {
        setFilter(current => ({ ...current, sort: sortType, page: 1 }));
      }
    }

    if (listTrackIds) {
      setFilter(current => ({ ...current, listTrackIds, page: 1 }));
    }

    if (search) {
      setSearchValue(search);
      setFilter(current => ({
        ...current,
        search,
        page: 1,
        sort: search.length > 0 ? '' : 'publishDate@desc',
      }));
    }
  }, [
    contributors,
    location.state,
    sections,
    setFilter,
    setIsShowFilterTrack,
    setSearchValue,
  ]);

  useEffect(() => {
    if (!isEmpty(filterRules)) {
      setNameCrate(filterRules?.name);
      setIsShowFilterTrack(true);
      setFilter({ ...filterRules, page: 1 });
      setSearchValue(filterRules?.search);
    }
  }, [
    actions,
    dispatch,
    filterRules,
    setFilter,
    setSearchValue,
    setIsShowFilterTrack,
    setShowFilter,
    setNameCrate,
    onClear,
  ]);

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  // useEffect(() => {
  //   if (filterTrack !== undefined && isFilter) {
  //     setFilter(filterTrack);
  //   }
  // }, [filterTrack, isFilter, setFilter]);

  // useEffect(() => {
  //   if (location.state?.type) {
  //     setShowFilter();
  //     setIsShowFilterTrack(true);
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
  //   }
  // }, [
  //   location.state,
  //   setFilter,
  //   setShowFilter,
  //   setSearchValue,
  //   setIsShowFilterTrack,
  // ]);

  // useEffect(() => {
  //   if (location.state?.date && location.state?.key) {
  //     setShowFilter();
  //     setIsShowFilterTrack(true);
  //   }
  // }, [
  //   location.state?.date,
  //   location.state?.key,
  //   setIsShowFilterTrack,
  //   setShowFilter,
  // ]);

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

  useEffect(() => {
    return () => {
      dispatch(actions.removeRule({}));
    };
  }, [actions, dispatch, initialFilter]);

  return (
    <Box>
      <HelmetPage title="Tracks" />
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
      {pageHeader?.track && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.track)}
        </Box>
      )}

      <Flex gridGap="15px" flexDirection={isLargerThan1280 ? 'row' : 'column'}>
        <Box w={isLargerThan1280 ? 'calc(100% - 250px)' : '100%'}>
          <Flex
            gridGap="8px"
            justifyContent="space-between"
            alignItems="center"
            mb="20px"
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
                  setFilter(current => ({
                    ...current,
                    page: 1,
                    labelId: value,
                  }));
                  const newFilters = {
                    ...filter,
                    page: 1,
                    labelId: value,
                  };
                  updateUrlWithFilters(newFilters);
                }}
              />
            </Box>
            <SearchAndSort
              listSort={
                (filter?.search?.length || 0) > 0
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
          <Box ref={ref}>
            {isShowFilterTrack && (
              <Flex mb="8px">
                <FilterItem
                  filterItems={filtersV1}
                  onFilter={handleChangeFilter}
                  handleFilterBpmOrYear={handleFilterBpmOrYear}
                  range={range}
                  onReset={onClear}
                  filter={filter}
                  setFilter={setFilter}
                  isShowPageTrack
                />
              </Flex>
            )}
            {isShowFilterTrack && (
              <Flex
                alignItems="center"
                justify={{ base: 'right', md: 'flex-end' }}
                mb="8px"
                style={{ gap: '15px' }}
              >
                <Flex>
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      onClear();
                      setNameCrate('');
                    }}
                  >
                    <IconReturn />
                  </Box>
                </Flex>
              </Flex>
            )}
          </Box>
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
            onHandleClickItemTagGenre={onHandleClickItemTagGenre}
          />
        </Box>
        {!isLargerThan1280 ? (
          <SimpleGrid
            gridGap="5px"
            columns={{ base: 1, sm: 3, md: 4, lg: 5, xl: 1 }}
          >
            <Top10Contributors />
            <Top10Genres />
            <Top10Tags />
          </SimpleGrid>
        ) : (
          <Box>
            <Top10Contributors />
            <Top10Genres />
            <Top10Tags />
          </Box>
        )}
      </Flex>
    </Box>
  );
});
