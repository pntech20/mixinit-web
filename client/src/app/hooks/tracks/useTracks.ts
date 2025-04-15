import { BPM_MAX, BPM_MIN, YEAR_MIN } from 'app/constants';
import {
  DATE_RANGE,
  SLIDER_TYPE,
  SORT_TYPE,
  TYPE_FILTER,
} from 'app/constants/enum';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useCratesSlice } from 'app/pages/PageCrate/slice';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getPaginationParams } from 'utils/pagination';
import { useCommunity } from '../Community/useCommunity';
import { useSections } from '../sections/useSections';
import { hideAndHiddenMyTrack } from 'app/apis/track/track';
import { useDisclosure } from '@chakra-ui/react';
import { useResultsPerPage } from '../resultsPerPage/useResultsPerPage';

export const useTracks = () => {
  const { perPageLocalStorage } = useResultsPerPage();
  const dispatch = useDispatch();
  const history = useHistory();
  const { search, pathname } = useLocation();
  const { actions } = useTrackSlice();
  const { actions: actionsCrates } = useCratesSlice();
  const { userDetail } = useSelector(selectAuth);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowAllTracks, setShowAllTracks] = useState(false);
  const [isShowFilterTrack, setIsShowFilterTrack] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>(DATE_RANGE.LAST_7_DAYS);
  const { sections } = useSections();
  const { contributors } = useCommunity();
  const query: any = queryString.parse(search);

  const [range, setRange] = useState({
    bpmStart: 0,
    bpmEnd: 220,
    yearFrom: 1950,
    yearTo: new Date().getFullYear(),
  });
  const [isHideAndHiddenMyTrack, setIsHideAndHiddenMyTrack] = useState(false);

  const {
    isOpen: isShowModalConfirmHideTrack,
    onOpen: onOpenModalConfirmHideTrack,
    onClose: onCloseModalConfirmHideTrack,
  } = useDisclosure();
  const itemsRef = useRef<any>([]);

  const {
    tracks,
    isLoading,
    pagination,
    featuredTracks,
    isLoadingFeaturedTrack,
    tracksByCreateAt,
    isLoadingCreateAt,
    top10Tracks,
    isLoadingTop10Track,
    listTracks,
    myTracks,
    totalPage,
    currentPage,
    topTracks,
    listTracksUploadedSuccess,
    isDownloadSuccess,
    trackIdDownloaded,
    isLoadingMore,
    isShowFilter,
    tokenMax,
    tokenMin,
    isCheckOpenModelBuySubscription,
    isUpdatingTrack,
    isUpdatingTrackSuccess,
    showFavoriteByMe,
  } = useSelector(selectSliceTracks);

  const timeoutRef = useRef<any>(null);
  const loaderMoreRef = useRef<any>(null);
  const location: any = useLocation();
  const [searchValue, setSearchValue] = useState<string>('');
  const isHomePage = pathname.includes('/home');
  const isLabelDetail = pathname.includes('/labels/') && query?.tab === '0';
  const isReleaseDetail = pathname.includes('/multipacks/');
  const isContributorDetail =
    pathname.includes('/contributors/') && query?.tab === '0';
  const isMyMedia = pathname.includes('/my-media');

  const handleUserSlug = useCallback(() => {
    if (pathname.includes('contributors')) {
      const [, , slug] = pathname?.split('/');
      return slug;
    }
    if (search.includes('tab=2')) return '';
    if (
      pathname.includes('my-media') ||
      search.includes('tag=0') ||
      search.includes('tag=1')
    )
      return userDetail?.slug;
  }, [pathname, search, userDetail?.slug]);

  const handleLabelId = useCallback(() => {
    if (pathname.includes('labels')) {
      const [, , labelId] = pathname?.split('/');
      return labelId;
    }

    if (pathname.includes('contributors/')) {
      const queryParams = new URLSearchParams(search);
      const labelId = queryParams.get('label');
      return labelId;
    }
    return '';
  }, [pathname, search]);

  const handleReleaseSlug = useCallback(() => {
    if (pathname.includes('multipacks')) {
      const [, , releaseSlug] = pathname?.split('/');
      return releaseSlug;
    }
    return '';
  }, [pathname]);

  const handleGenId = useCallback(() => {
    if (location.pathname.includes('genres')) {
      return location.search.split('id=')[1];
    }
    return '';
  }, [location.pathname, location.search]);

  const DEFAULT_FILTERS = useMemo(() => {
    return {
      showAudio: true,
      showVideo: true,
      clean: true,
      dirty: true,
      bpmStart: 0,
      bpmEnd: 220,
      yearFrom: 1950,
      yearTo: new Date().getFullYear(),
      sort:
        isHomePage || isLabelDetail || isContributorDetail
          ? SORT_TYPE.TOP_MOVERS_30
          : isReleaseDetail
          ? SORT_TYPE.INDEX_ASC
          : SORT_TYPE.PUBLISHED_AT_DESC,
      userSlug: handleUserSlug(),
      labelId: handleLabelId(),
      releaseSlug: handleReleaseSlug(),
      search: '',
      page: 1,
      pageSize: isHomePage ? 20 : perPageLocalStorage,
      genreId: handleGenId(),
      isMyMedia,
      showFavoriteByMe,
    };
  }, [
    isHomePage,
    isLabelDetail,
    isContributorDetail,
    isReleaseDetail,
    handleUserSlug,
    handleLabelId,
    handleReleaseSlug,
    perPageLocalStorage,
    handleGenId,
    isMyMedia,
    showFavoriteByMe,
  ]);

  const initialFilter: any = useMemo(() => {
    return {
      showAudio: true,
      showVideo: true,
      clean: true,
      dirty: true,
      bpmStart: 0,
      bpmEnd: 220,
      yearFrom: 1950,
      yearTo: new Date().getFullYear(),
      sort:
        isHomePage || isLabelDetail || isContributorDetail
          ? SORT_TYPE.TOP_MOVERS_30
          : isReleaseDetail
          ? SORT_TYPE.INDEX_ASC
          : SORT_TYPE.PUBLISHED_AT_DESC,
      userSlug: handleUserSlug(),
      labelId: handleLabelId(),
      releaseSlug: handleReleaseSlug(),
      search: '',
      page: 1,
      pageSize: isHomePage ? 20 : perPageLocalStorage,
      genreId: handleGenId(),
      isMyMedia,
      showFavoriteByMe,
    };
  }, [
    isHomePage,
    isLabelDetail,
    isContributorDetail,
    isReleaseDetail,
    handleUserSlug,
    handleLabelId,
    handleReleaseSlug,
    perPageLocalStorage,
    handleGenId,
    isMyMedia,
    showFavoriteByMe,
  ]);

  const updateUrlWithFilters = useCallback(
    (newFilter: any) => {
      const queryParams = new URLSearchParams();
      if (newFilter.search) queryParams.set('search', newFilter.search);
      if (newFilter.sort) queryParams.set('sort', newFilter.sort);
      if (newFilter.labelId) queryParams.set('label', newFilter.labelId);
      if (newFilter.yearTo) queryParams.set('yearTo', newFilter.yearTo);
      if (newFilter.yearFrom) queryParams.set('yearFrom', newFilter.yearFrom);
      if (newFilter.bpmEnd) queryParams.set('bpmEnd', newFilter.bpmEnd);
      if (newFilter.showAudio != null)
        queryParams.set('showAudio', newFilter.showAudio);
      if (newFilter.showVideo != null)
        queryParams.set('showVideo', newFilter.showVideo);
      if (newFilter.clean != null) queryParams.set('clean', newFilter.clean);
      if (newFilter.dirty != null) queryParams.set('dirty', newFilter.dirty);
      if (newFilter.showFavoriteByMe != null)
        queryParams.set('showFavoriteByMe', newFilter.showFavoriteByMe);

      if (newFilter.showContributors?.length) {
        queryParams.set(
          'contributors',
          JSON.stringify(newFilter.showContributors),
        );
      }

      if (newFilter.showGenres?.length) {
        queryParams.set('genres', JSON.stringify(newFilter.showGenres));
      }

      if (newFilter.showTags?.length) {
        queryParams.set('tags', JSON.stringify(newFilter.showTags));
      }

      const queryString = queryParams.toString();

      const newUrl = `${pathname}?${queryString}`;
      window.history.replaceState(null, '', newUrl);
    },
    [pathname],
  );

  const [filter, setFilter] = useState<any>(DEFAULT_FILTERS);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const urlFilters: any = {};

    const searchParam = queryParams.get('search');
    if (searchParam) {
      urlFilters.search = searchParam;
      urlFilters.sort = '';
      setSearchValue(searchParam);
    }

    const sortParam = queryParams.get('sort');
    if (sortParam) {
      urlFilters.sort = sortParam;
    }

    const yearToParam = queryParams.get('yearTo');
    if (yearToParam) {
      urlFilters.yearTo = Number(yearToParam);
    }

    const yearFromParam = queryParams.get('yearFrom');
    if (yearFromParam) {
      urlFilters.yearFrom = Number(yearFromParam);
    }

    const bpmEndParam = queryParams.get('bpmEnd');
    if (bpmEndParam) {
      urlFilters.bpmEnd = Number(bpmEndParam);
    }

    const bpmStartParam = queryParams.get('bpmStart');
    if (bpmStartParam) {
      urlFilters.bpmStart = Number(bpmStartParam);
    }

    const showAudioParam = queryParams.get('showAudio');
    if (showAudioParam) {
      urlFilters.showAudio = showAudioParam === 'true' ? true : false;
    }

    const showVideoParam = queryParams.get('showVideo');
    if (showVideoParam) {
      urlFilters.showVideo = showVideoParam === 'true' ? true : false;
    }

    const cleanParam = queryParams.get('clean');
    if (cleanParam) {
      urlFilters.clean = cleanParam === 'true' ? true : false;
    }

    const dirtyParam = queryParams.get('dirty');
    if (dirtyParam) {
      urlFilters.dirty = dirtyParam === 'true' ? true : false;
    }

    const showFavoriteByMeParam = queryParams.get('showFavoriteByMe');
    if (showFavoriteByMeParam) {
      urlFilters.showFavoriteByMe =
        showFavoriteByMeParam === 'true' ? true : false;
    }

    const contributorsParam = queryParams.get('contributors');
    if (contributorsParam) {
      try {
        urlFilters.showContributors = JSON.parse(contributorsParam);
      } catch (e) {
        console.error('Failed to parse contributors from URL');
      }
    }
    const labelsParam = queryParams.get('label');
    if (labelsParam) {
      try {
        urlFilters.labelId = labelsParam;
      } catch (e) {
        console.error('Failed to parse labels from URL');
      }
    }

    const genresParam = queryParams.get('genres');
    if (genresParam) {
      try {
        urlFilters.showGenres = JSON.parse(genresParam);
      } catch (e) {
        console.error('Failed to parse genres from URL');
      }
    }
    const tagsParam = queryParams.get('tags');
    if (tagsParam) {
      try {
        urlFilters.showTags = JSON.parse(decodeURIComponent(tagsParam));
      } catch (e) {
        console.error('Failed to parse tags from URL');
      }
    }

    // Only update filter if we have URL params and it's the initial load
    if (Object.keys(urlFilters).length > 0) {
      setIsShowFilterTrack(true);
      setFilter(current => ({
        ...current,
        ...urlFilters,
        page: 1,
      }));
    }
  }, [search]);

  useEffect(() => {
    if (filter.showFavoriteByMe !== undefined)
      dispatch(actions.updateShowFavoriteByMe(filter.showFavoriteByMe));
  }, [actions, dispatch, filter.showFavoriteByMe]);

  useEffect(() => {
    if (
      filter?.bpmStart ||
      filter?.bpmEnd ||
      filter?.yearFrom ||
      filter?.yearTo
    ) {
      setRange({
        bpmStart: filter?.bpmStart,
        bpmEnd: filter?.bpmEnd,
        yearFrom: filter?.yearFrom,
        yearTo: filter?.yearTo,
      });
    }
  }, [filter]);

  const onGetTracks = useCallback(async () => {
    const page = filter.page || 1;
    const pageSize = filter?.pageSize || perPageLocalStorage;
    const paramsPagination = getPaginationParams({ page, pageSize });
    dispatch(
      actions.getTracksRequest({
        params: paramsPagination,
        filter: {
          ...filter,
          sort: filter.sort,
          showSections: filter?.showSections?.map(item => item?.value),
          showTrackKeys: filter?.showTrackKeys?.map(item => item?.value),
          showContributors: filter?.showContributors?.map(item => item?.value),
          showTags: filter?.showTags?.map(item => item?.value),
          showGenres: filter?.showGenres?.map(item => item?.value),
          showSubGenres: filter?.showSubGenres?.map(item => item?.value),
          labelId: filter.labelId || handleLabelId(),
          releaseSlug: handleReleaseSlug(),
          // clean: isEmpty(getLocalStorage('clean')) || getLocalStorage('clean'),
          // dirty: isEmpty(getLocalStorage('dirty')) || getLocalStorage('dirty'),
        },
      }),
    );
  }, [
    perPageLocalStorage,
    actions,
    dispatch,
    filter,
    handleLabelId,
    handleReleaseSlug,
  ]);

  const updateTrack = useCallback(
    (trackId, dataUpdate) => {
      const data = {
        trackId,
        dataUpdate,
      };
      dispatch(actions.updateTrackRequest(data));
    },
    [actions, dispatch],
  );

  const onDeleteTrack = useCallback(
    (trackId: string) => {
      dispatch(actions.deleteTracksRequest({ trackId }));
    },
    [actions, dispatch],
  );

  const onClear = useCallback(
    (labelId?: string) => {
      dispatch(actionsCrates.removeRule({}));
      labelId
        ? setFilter({
            ...DEFAULT_FILTERS,
            labelId,
          })
        : setFilter(DEFAULT_FILTERS);
    },
    [DEFAULT_FILTERS, actionsCrates, dispatch],
  );

  const handleChange = useCallback(
    e => {
      setSearchValue(e.target.value);
      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setFilter(current => {
          return {
            ...current,
            search: e.target.value,
            sort: e.target.value.length > 0 ? '' : 'publishDate@desc',
            page: 1,
          };
        });
        const newFilters = {
          ...filter,
          page: 1,
          sort: e.target.value.length > 0 ? '' : 'publishDate@desc',
          search: e.target.value,
        };

        updateUrlWithFilters(newFilters);
      }, 1500);
    },
    [filter, updateUrlWithFilters],
  );

  const handleChangeFilter = useCallback(
    (event, key, type: any) => {
      switch (type) {
        case SLIDER_TYPE.DROPDOWN:
          setFilter(current => ({
            ...current,
            [key]: event,
          }));
          const newFilters = {
            ...filter,
            page: 1,
            [key]: event,
          };

          updateUrlWithFilters(newFilters);
          break;
        case TYPE_FILTER.TYPE_QUERY_FILTER:
          setFilter(current => ({
            ...current,
            [type]: event ? TYPE_FILTER.ALL : TYPE_FILTER.EACH,
          }));
          break;
        case SLIDER_TYPE.BPM:
          setFilter(current => ({
            ...current,
            bpmFrom: BPM_MIN,
            bpmTo: BPM_MAX,
          }));
          break;
        case SLIDER_TYPE.PRICE:
          setFilter(current => ({
            ...current,
            priceFrom: tokenMin,
            priceTo: tokenMax,
          }));
          break;
        case SLIDER_TYPE.YEAR:
          setFilter(current => ({
            ...current,
            yearFrom: YEAR_MIN,
            yearTo: new Date().getFullYear(),
          }));
          break;
        default:
          const { name } = event.target;
          setFilter(current => ({
            ...current,
            [name]: !filter[name],
          }));
          break;
      }
    },
    [filter, updateUrlWithFilters, tokenMin, tokenMax],
  );

  const handleFilterBpmOrYear = useCallback(
    (key, value) => {
      setRange({
        ...range,
        [key]: value,
      });
      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setFilter(current => ({
          ...current,
          [key]: value,
          page: 1,
        }));
        const newFilters = {
          ...filter,
          page: 1,
          [key]: value,
        };

        updateUrlWithFilters(newFilters);
      }, 500);
    },
    [filter, range, updateUrlWithFilters],
  );

  const handleFilterCheckbox = useCallback(
    (key, value) => {
      setFilter(current => ({
        ...current,
        [key]: value,
        page: 1,
      }));
      const newFilters = {
        ...filter,
        page: 1,
        [key]: value,
      };

      updateUrlWithFilters(newFilters);
    },
    [filter, updateUrlWithFilters],
  );

  const fetchMoreData = useCallback(() => {
    setFilter(current => {
      return {
        ...current,
        page: currentPage + 1,
      };
    });
  }, [currentPage]);

  const onHandleClickItemTagGenre = useCallback(
    (type, data) => {
      const queryParams = new URLSearchParams(search);

      if (type === SORT_TYPE.SHOW_TAGS) {
        queryParams.set(
          'tags',
          JSON.stringify([
            {
              value: data?._id,
              label: data?.name,
            },
          ]),
        );
      }
      if (type === SORT_TYPE.SHOW_GENRES) {
        queryParams.set(
          'genres',
          JSON.stringify([
            {
              value: data?._id,
              label: data?.name,
            },
          ]),
        );
      }

      const queryString = queryParams.toString();
      // Cập nhật URL với chuỗi đã được decode
      const newUrl = `${pathname}?${queryString}`;
      setIsShowFilterTrack(true);
      setFilter(current => ({
        ...current,
        [type]: [
          {
            value: data?._id,
            label: data?.name,
          },
        ],
        page: 1,
      }));
      window.history.replaceState(null, '', newUrl);
    },
    [pathname, search],
  );

  const handleShowAllTrack = useCallback(
    itemsRef => {
      setShowAllTracks(pre => !pre);
      if (itemsRef?.current.length) {
        itemsRef.current.map(ref =>
          isShowAllTracks
            ? ref.onHandleToggleClose()
            : ref.onHandleToggleOpen(),
        );
      }
    },
    [isShowAllTracks, setShowAllTracks],
  );

  const setIsUpdatingTrack = useCallback(
    isUpdatingTrack => {
      dispatch(
        actions.setIsUpdatingTrack({
          isUpdatingTrack,
        }),
      );
    },
    [actions, dispatch],
  );

  const setIsUpdatingTrackSuccess = useCallback(
    isUpdatingTrackSuccess => {
      dispatch(
        actions.setIsUpdatingTrackSuccess({
          isUpdatingTrackSuccess,
        }),
      );
    },
    [actions, dispatch],
  );

  const removeToggleShowFilter = useCallback(() => {
    dispatch(actions.removeToggleShowFilter());
  }, [actions, dispatch]);

  const setShowFilter = useCallback(() => {
    dispatch(actions.setShowFilter());
  }, [actions, dispatch]);

  const getTokenMax = useCallback(() => {
    dispatch(actions.getTokenMaxRequest());
  }, [actions, dispatch]);

  const handleHideAndHiddenMyTrack = useCallback(
    async (track: any) => {
      setIsHideAndHiddenMyTrack(true);
      const data: any = await hideAndHiddenMyTrack({ track });

      if (data) dispatch(actions.updateTextHideAndHiddenMyTrack({ data }));

      setIsHideAndHiddenMyTrack(false);
      onCloseModalConfirmHideTrack();
    },
    [actions, dispatch, onCloseModalConfirmHideTrack],
  );

  const addRemoveFavoriteTrack = useCallback(
    trackId => {
      dispatch(actions.updateFavoritedTrackRequest({ trackId }));
    },
    [actions, dispatch],
  );

  useEffect(() => {
    if (location.state?.showFavoriteByMe !== undefined) {
      setShowFilter();
      setIsShowFilterTrack(true);
      setFilter(current => ({
        ...current,
        showFavoriteByMe: Boolean(location.state?.showFavoriteByMe),
      }));
      const newFilters = {
        ...filter,
        showFavoriteByMe: Boolean(location.state?.showFavoriteByMe),
      };

      updateUrlWithFilters(newFilters);
      history.replace({
        ...location,
        state: undefined,
      });
    }
  }, [
    filter,
    history,
    location,
    location.state,
    setFilter,
    setIsShowFilterTrack,
    setShowFilter,
    updateUrlWithFilters,
  ]);

  return {
    handleShowAllTrack,
    onGetTracks,
    tracks,
    isLoading,
    pagination,
    filter,
    handleChange,
    handleChangeFilter,
    setFilter,
    featuredTracks,
    isLoadingFeaturedTrack,
    tracksByCreateAt,
    isLoadingCreateAt,
    onClear,
    top10Tracks,
    isLoadingTop10Track,
    listTracks,
    myTracks,
    fetchMoreData,
    currentPage,
    isOpen,
    setIsOpen,
    DEFAULT_FILTERS,
    initialFilter,
    setSelectedTime,
    selectedTime,
    topTracks,
    isShowAllTracks,
    setShowAllTracks,
    onDeleteTrack,
    updateTrack,
    listTracksUploadedSuccess,
    isDownloadSuccess,
    trackIdDownloaded,
    isLoadingMore,
    loaderMoreRef,
    onHandleClickItemTagGenre,
    itemsRef,
    isShowFilter,
    removeToggleShowFilter,
    setShowFilter,
    getTokenMax,
    tokenMax,
    tokenMin,
    searchValue,
    setSearchValue,
    isCheckOpenModelBuySubscription,
    sections,
    contributors,
    isShowFilterTrack,
    setIsShowFilterTrack,
    totalPage,
    isUpdatingTrack,
    setIsUpdatingTrack,
    isUpdatingTrackSuccess,
    setIsUpdatingTrackSuccess,
    handleFilterBpmOrYear,
    handleFilterCheckbox,
    range,
    handleHideAndHiddenMyTrack,
    isHideAndHiddenMyTrack,
    isShowModalConfirmHideTrack,
    onOpenModalConfirmHideTrack,
    onCloseModalConfirmHideTrack,
    addRemoveFavoriteTrack,
    updateUrlWithFilters,
  };
};
