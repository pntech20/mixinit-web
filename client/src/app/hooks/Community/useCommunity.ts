import { useCommunitySlice } from 'app/components/Community/slice';
import { selectSliceCommunity } from 'app/components/Community/slice/selectors';
import { SORT_TYPE } from 'app/constants/enum';
import { UsernameFilter } from 'app/models';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useResultsPerPage } from '../resultsPerPage/useResultsPerPage';

export const useCommunity = () => {
  const { perPageLocalStorage } = useResultsPerPage();
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const { actions } = useCommunitySlice();
  const timeoutRef = useRef<any>(null);
  const isHomePage = pathname.includes('/home');

  const {
    users = [],
    isLoading,
    pagination,
    isLoadingFollow,
    isLoadingMore,
    currentPage,
    totalPage,
    contributors,
    topContributors,
    isLoadingTopContributor,
    topContributorsCache,
  } = useSelector(selectSliceCommunity);

  const DEFAULT_FILTERS = useMemo(() => {
    return {
      sort: isHomePage
        ? SORT_TYPE.TOP_MOVERS_30
        : SORT_TYPE.LATEST_UPLOADED_DESC,
      search: '',
      page: 1,
      pageSize:
        pathname.includes('/contributors') || pathname.includes('/charts')
          ? perPageLocalStorage
          : 10,
      labelId: 'all',
    };
  }, [isHomePage, pathname, perPageLocalStorage]);
  const [filter, setFilter] = useState<UsernameFilter>(DEFAULT_FILTERS);
  const [searchValue, setSearchValue] = useState<string>('');

  const updateUrlWithFilters = useCallback(
    (newFilter: any) => {
      const queryParams = new URLSearchParams();

      if (newFilter.title) queryParams.set('search', newFilter.search);
      if (newFilter.sort) queryParams.set('sort', newFilter.sort);
      if (newFilter.labelId) queryParams.set('labelId', newFilter.labelId);
      const queryString = queryParams.toString();
      const newUrl = `${pathname}?${queryString}`;
      window.history.replaceState(null, '', newUrl);
    },
    [pathname],
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const urlFilters: any = {};

    const searchParam = queryParams.get('search');
    if (searchParam) {
      urlFilters.search = searchParam;
      setSearchValue(searchParam);
    }

    const sortParam = queryParams.get('sort');
    if (sortParam) {
      urlFilters.sort = sortParam;
    }
    const labelsParam = queryParams.get('labelId');
    if (labelsParam) {
      urlFilters.labelId = labelsParam;
    }
    // Only update filter if we have URL params and it's the initial load
    if (Object.keys(urlFilters).length > 0) {
      setFilter(current => ({
        ...current,
        ...urlFilters,
        page: 1,
      }));
    }
  }, [search]);

  const onGetCommunity = useCallback(
    (payload?: any) => {
      dispatch(
        actions.getCommunityRequest({
          filter: {
            ...filter,
            search: payload?.search || filter?.search,
            sort: payload?.sort || filter?.sort,
            labelId: payload?.labelId || filter?.labelId,
            pageSize: payload?.pageSize || filter?.pageSize,
          },
        }),
      );
    },
    [actions, dispatch, filter],
  );

  const updateTopContributor = useCallback(
    (data?: any) => {
      dispatch(actions.updateTopContributor(data));
    },
    [actions, dispatch],
  );

  const onGetTopCommunity = useCallback(
    (payload?: any) => {
      dispatch(
        actions.getTopCommunityRequest({
          filter: {
            ...filter,
            search: payload?.search || filter?.search,
            sort: payload?.sort || filter?.sort,
            labelId: payload?.labelId || filter?.labelId,
          },
        }),
      );
    },
    [actions, dispatch, filter],
  );

  const onGetContributors = useCallback(() => {
    dispatch(actions.getContributorsRequest());
  }, [actions, dispatch]);

  const onToggleBlockUser = useCallback(
    user => {
      dispatch(actions.toggleBlockUserRequest({ _id: user._id }));
    },
    [dispatch, actions],
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
          search: e.target.value,
          page: 1,
        }));
        const newFilters = {
          ...filter,
          page: 1,
          search: e.target.value,
        };

        updateUrlWithFilters(newFilters);
      }, 500);
    },
    [filter, updateUrlWithFilters],
  );

  const handleChangeFilter = useCallback(
    (event, key) => {
      setFilter(current => ({
        ...current,
        [key]: event,
        page: 1,
      }));
      const newFilters = {
        ...filter,
        page: 1,
        [key]: event,
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

  const handleObserverLoadMoreUsers = useCallback(
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
    updateTopContributor,
    onGetCommunity,
    handleChange,
    handleChangeFilter,
    onToggleBlockUser,
    users,
    isLoading,
    pagination,
    isLoadingFollow,
    setFilter,
    handleObserverLoadMoreUsers,
    setSearchValue,
    isLoadingMore,
    currentPage,
    onGetContributors,
    contributors,
    searchValue,
    filter,
    totalPage,
    onGetTopCommunity,
    topContributors,
    isLoadingTopContributor,
    topContributorsCache,
  };
};
