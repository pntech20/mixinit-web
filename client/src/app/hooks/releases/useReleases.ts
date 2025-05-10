import { TOKEN_MAX, YEAR_MIN } from 'app/constants';
import {
  DATE_RANGE,
  NAME_SLIDER,
  SLIDER_TYPE,
  SORT_TYPE,
} from 'app/constants/enum';
import { Track } from 'app/models';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useReleaseDetailSlice } from 'app/pages/ReleaseDetail/slice';
import { selectReleaseDetail } from 'app/pages/ReleaseDetail/slice/selectors';
import { useReleasesSlice } from 'app/pages/Releases/slice';
import { selectSliceReleases } from 'app/pages/Releases/slice/selectors';
import { default as queryString } from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getPaginationParams } from 'utils/pagination';
import { useUserDetail } from '../Community/userInfo';
import { useResultsPerPage } from '../resultsPerPage/useResultsPerPage';

export const useReleases = () => {
  const { perPageLocalStorage } = useResultsPerPage();
  const {
    releases,
    isLoading,
    pagination,
    isFeaturesLoading,
    releasesByFeatures,
    isLoading7Days,
    releasesBy7Days,
    isCreateAtLoading,
    releasesByCreateAt,
    isEditReleaseSuccess,
    isCreateReleaseSuccess,
    totalPage,
    currentPage,
    topReleases,
    isLoadingRelease,
    isLoadingMore,
    isDeleteReleaseSuccess,
    isShowModalDeleteRelease,
  } = useSelector(selectSliceReleases);
  const { userDetail } = useSelector(selectAuth);
  const { actions: actionsReleaseDetail } = useReleaseDetailSlice();

  const {
    releasesUser,
    releaseDetail,
    tracksByReleaseId,
    isLoading: isLoadingReleaseDegtail,
    isLoadingTrackByReleaseId,
  } = useSelector(selectReleaseDetail);
  const { userDetails: userConDetails } = useUserDetail();

  const [tabActive, setTabActive] = useState(0);
  const history = useHistory();
  const [selectedTime, setSelectedTime] = useState<any>(DATE_RANGE.LAST_7_DAYS);
  const { search, pathname } = useLocation();
  const [searchValue, setSearchValue] = useState<string>('');
  const [arraySearchGenres, setArraySearchGenres] = useState<any>([]);
  const [arraySearchTags, setArraySearchTags] = useState<any>([]);
  const [isShowFilterRelease, setIsShowFilterRelease] = useState(false);
  const isHomePage = pathname.includes('/home');

  const handleUserId = useCallback(() => {
    if (pathname.includes('contributors')) {
      return userConDetails?._id;
    }
    if (['/my-releases', '/my-media', '/my-label'].includes(pathname))
      return userDetail?._id;
  }, [pathname, userConDetails?._id, userDetail?._id]);

  const timeoutRef = useRef<any>(null);

  const handleLabelId = useCallback(() => {
    if (pathname.includes('labels')) {
      const [, , labelId] = pathname?.split('/');
      return labelId;
    }
    return '';
  }, [pathname]);

  const DEFAULT_FILTERS = useMemo(() => {
    return {
      showAudio: true,
      showVideo: true,
      dateRange: DATE_RANGE.ALL_TIME,
      clean: true,
      dirty: true,
      sort: isHomePage ? SORT_TYPE.TOP_MOVERS_30 : SORT_TYPE.CREATED_AT_DESC,
      featuredOnly: true,
      userId: handleUserId(),
      labelId: handleLabelId(),
      pageSize: isHomePage ? 10 : perPageLocalStorage,
    };
  }, [isHomePage, handleUserId, handleLabelId, perPageLocalStorage]);

  const [filter, setFilter] = useState<any>(DEFAULT_FILTERS);

  const [releaseTracks, setReleaseTracks] = useState<Track[]>([]);

  useEffect(() => {
    setReleaseTracks(tracksByReleaseId || []);
  }, [tracksByReleaseId]);

  const updateUrlWithFilters = useCallback(
    (newFilter: any) => {
      const queryParams = new URLSearchParams();

      if (newFilter.title) queryParams.set('search', newFilter.title);
      if (newFilter.sort) queryParams.set('sort', newFilter.sort);
      if (newFilter.showContributors?.length) {
        queryParams.set(
          'contributors',
          JSON.stringify(newFilter.showContributors),
        );
      }
      if (newFilter.showSections?.length) {
        queryParams.set('labels', JSON.stringify(newFilter.showSections));
      }
      if (newFilter.showTags?.length) {
        queryParams.set('tags', JSON.stringify(newFilter.showTags));
      }
      if (newFilter.showGenres?.length) {
        queryParams.set('genres', JSON.stringify(newFilter.showGenres));
      }

      const queryString = queryParams.toString();
      const newUrl = `${pathname}?${queryString}`;
      window.history.replaceState(null, '', newUrl);
    },
    [pathname],
  );

  const onSearchTracksInRelease = useCallback(
    e => {
      const { value = '' } = e.target;
      let result = tracksByReleaseId || [];

      if (value.toLowerCase().trim() !== '') {
        result = [...result].filter(item =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        );
      }

      setReleaseTracks(result);
    },
    [tracksByReleaseId],
  );

  const handShowModalDeleteRelease = value => {
    dispatch(actions.isShowModalDeleteRelease(value));
  };

  const dispatch = useDispatch();
  const { actions } = useReleasesSlice();

  const onGetReleases = useCallback(() => {
    const page = filter.page || 1;
    const pageSize = filter?.pageSize || perPageLocalStorage;
    const params = getPaginationParams({ page, pageSize });
    dispatch(
      actions.getReleasesRequest({
        params,
        filter: {
          ...filter,
          sort: filter.sort,
          dateRange: filter.dateRange,
          showSections: filter?.showSections?.map(item => item.value),
          showContributors: filter?.showContributors?.map(item => item.value),
          showTags: filter?.showTags?.map(item => item.value),
          showGenres: filter?.showGenres?.map(item => item.value),
          // ...querystring.parse(search),
        },
      }),
    );
  }, [perPageLocalStorage, actions, dispatch, filter]);

  const onGetReleasesTop100 = useCallback(() => {
    const page = filter.page || 1;
    const pageSize = 100;
    const params = getPaginationParams({ page, pageSize });
    dispatch(
      actions.getReleasesRequest({
        params,
        filter: {
          ...filter,
          sort: filter.sort,
          dateRange: filter.dateRange,
          showSections: filter?.showSections?.map(item => item.value),
          showContributors: filter?.showContributors?.map(item => item.value),
          showTags: filter?.showTags?.map(item => item.value),
          showGenres: filter?.showGenres?.map(item => item.value),
          // ...querystring.parse(search),
        },
      }),
    );
  }, [actions, dispatch, filter]);

  const onGetByCreateReleases = useCallback(
    (page = 1, pageSize = 10) => {
      const params = getPaginationParams({ page, pageSize });
      dispatch(
        actions.getByCreateReleasesRequest({
          params,
          filter: {
            sort: 'createdAt:DESC',
          },
        }),
      );
    },
    [actions, dispatch],
  );

  const onGetReleaseDetail = useCallback(
    (_id: string) => {
      dispatch(actionsReleaseDetail.getReleaseDetailRequest({ _id }));
    },
    [actionsReleaseDetail, dispatch],
  );

  const onGetAllTrackByReleaseId = useCallback(
    (_id: string) => {
      dispatch(
        actionsReleaseDetail.getAllTrackByReleaseIdRequest({
          _id,
          sort: filter?.sort,
        }),
      );
    },
    [actionsReleaseDetail, dispatch, filter],
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const urlFilters: any = {};

    const searchParam = queryParams.get('search');
    if (searchParam) {
      urlFilters.title = searchParam;
      setSearchValue(searchParam);
    }

    const sortParam = queryParams.get('sort');
    if (sortParam) {
      urlFilters.sort = sortParam;
    }

    const contributorsParam = queryParams.get('contributors');
    if (contributorsParam) {
      try {
        urlFilters.showContributors = JSON.parse(contributorsParam);
      } catch (e) {
        console.error('Failed to parse contributors from URL');
      }
    }
    const labelsParam = queryParams.get('labels');
    if (labelsParam) {
      try {
        urlFilters.showSections = JSON.parse(labelsParam);
      } catch (e) {
        console.error('Failed to parse labels from URL');
      }
    }
    const tagsParam = queryParams.get('tags');
    if (tagsParam) {
      try {
        urlFilters.showTags = JSON.parse(tagsParam);
      } catch (e) {
        console.error('Failed to parse tags from URL');
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
    // Only update filter if we have URL params and it's the initial load
    if (Object.keys(urlFilters).length > 0) {
      setIsShowFilterRelease(true);
      setFilter(current => ({
        ...current,
        ...urlFilters,
        page: 1,
      }));
    }
  }, [search]);

  const handleChangeFilter = useCallback(
    (value, key) => {
      key === 'showGenres' && setArraySearchGenres(value);
      key === 'showTags' && setArraySearchTags(value);
      const filters = {};
      switch (key) {
        case NAME_SLIDER.NUMBER_TRACKS:
        case NAME_SLIDER.RELEASE_TOKENS:
        case NAME_SLIDER.RELEASE_YEAR:
          const valueStart = value[0];
          const valueEnd = value[1];
          filters[`${key}From`] = valueStart;
          filters[`${key}To`] = valueEnd;
          break;
        case SLIDER_TYPE.NUMBER_TRACKS:
          setFilter(current => ({
            ...current,
            page: 1,
            numberTracksFrom: 1,
            numberTracksTo: 100,
          }));
          break;
        case SLIDER_TYPE.RELEASE_YEAR:
          setFilter(current => ({
            ...current,
            page: 1,
            releaseYearFrom: YEAR_MIN,
            releaseYearTo: new Date().getFullYear(),
          }));
          break;
        case SLIDER_TYPE.RELEASE_TOKEN:
          setFilter(current => ({
            ...current,
            page: 1,
            releaseTokensFrom: 0,
            releaseTokensTo: TOKEN_MAX,
          }));
          break;
        default:
          filters[key] = value;
          break;
      }
      setFilter(current => ({
        ...current,
        page: 1,
        ...filters,
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
  const handleChangeCheckbox = useCallback(
    (event, key, type = 'dropdown') => {
      const { name } = event.target;
      setFilter(current => ({
        ...current,
        page: 1,
        [name]: !filter[name],
      }));
    },
    [filter],
  );

  const handleChange = useCallback(
    e => {
      setSearchValue(e.target.value);
      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setFilter(current => ({
          ...current,
          page: 1,
          title: e.target.value,
        }));
        const newFilters = {
          ...filter,
          page: 1,
          title: e.target.value,
        };

        updateUrlWithFilters(newFilters);
      }, 500);
    },
    [filter, updateUrlWithFilters],
  );

  const onResetFilter = useCallback(() => {
    setSearchValue('');
    setFilter(DEFAULT_FILTERS);
    updateUrlWithFilters(DEFAULT_FILTERS);
  }, [DEFAULT_FILTERS, updateUrlWithFilters]);

  useEffect(() => {
    const query: any = queryString.parse(search);
    if (query && query.tab) {
      setTabActive(+query.subtab || 0);
    }
  }, [search]);

  const handleChangeTabs = value => {
    setTabActive(value);
    history.push({
      pathname: '/my-releases',
      search: value === 0 ? '?tab=1&subtab=0' : '?tab=1&subtab=1',
      state: { release: null },
    });
  };

  const fetchMoreData = useCallback(() => {
    // onGetReleases(currentPage + 1, DEFAULT_PAGE_SIZE);
  }, []);

  const onDeleteRelease = useCallback(
    (releaseId: string) => {
      dispatch(actions.deleteReleaseRequest({ releaseId }));
    },
    [actions, dispatch],
  );

  const handleObserverLoadMoreRelease = useCallback(
    entities => {
      const target = entities[0];
      if (
        target.isIntersecting &&
        totalPage > currentPage &&
        currentPage !== 0
      ) {
        fetchMoreData();
      }
    },
    [currentPage, fetchMoreData, totalPage],
  );

  return {
    onGetReleases,
    releases,
    isLoading,
    pagination,
    handleChangeFilter,
    handleChange,
    onResetFilter,
    setFilter,
    onGetReleaseDetail,
    releaseDetail,
    onSearchTracksInRelease,
    releaseTracks,
    tabActive,
    handleChangeTabs,
    isFeaturesLoading,
    releasesByFeatures,
    isLoading7Days,
    releasesBy7Days,
    onGetByCreateReleases,
    isCreateAtLoading,
    releasesByCreateAt,
    filter,
    userDetail,
    isEditReleaseSuccess,
    isCreateReleaseSuccess,
    currentPage,
    DEFAULT_FILTERS,
    setSelectedTime,
    topReleases,
    selectedTime,
    handleChangeCheckbox,
    onGetAllTrackByReleaseId,
    tracksByReleaseId,
    releasesUser,
    isLoadingReleaseDegtail,
    isLoadingRelease,
    isLoadingTrackByReleaseId,
    onDeleteRelease,
    fetchMoreData,
    handleObserverLoadMoreRelease,
    isLoadingMore,
    searchValue,
    setSearchValue,
    arraySearchGenres,
    arraySearchTags,
    totalPage,
    isShowFilterRelease,
    setIsShowFilterRelease,
    isDeleteReleaseSuccess,
    handShowModalDeleteRelease,
    isShowModalDeleteRelease,
    onGetReleasesTop100,
  };
};
