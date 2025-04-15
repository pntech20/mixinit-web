import {
  DATE_RANGE,
  LABEL_DETAIL_TYPE,
  SLIDER_TYPE,
  SORT_TYPE,
} from 'app/constants/enum';
import { Track } from 'app/models';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useSectionsSlice } from 'app/pages/Sections/slice';
import { selectSliceSections } from 'app/pages/Sections/slice/selectors';
import { default as queryString } from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPaginationParams } from 'utils/pagination';
import { useUserDetail } from '../Community/userInfo';

export const useSections = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(LABEL_DETAIL_TYPE.TRACKS);

  const {
    sections,
    isLoading,
    sectionDetail,
    mySection,
    topLabels,
    isLoadingTopLabels,
    allLabels,
    cacheLabels,
  } = useSelector(selectSliceSections);
  const { userDetail } = useSelector(selectAuth);
  const { userDetails: userConDetails } = useUserDetail();

  const [selectedTime, setSelectedTime] = useState<any>(DATE_RANGE.LAST_7_DAYS);

  const dispatch = useDispatch();
  const { actions } = useSectionsSlice();
  const { search, pathname } = useLocation();
  const [searchValue, setSearchValue] = useState<string>('');
  const timeoutRef = useRef<any>(null);

  const DEFAULT_FILTERS = useMemo(() => {
    return {
      sort: SORT_TYPE.ORDER_ASC,
      search: '',
      userId: pathname.includes('contributors')
        ? userConDetails
          ? userConDetails?._id
          : userDetail?._id
        : '',
    };
  }, [pathname, userConDetails, userDetail?._id]);
  const [filter, setFilter] = useState<any>(DEFAULT_FILTERS);
  const [labelTracks, setLabelTracks] = useState<Track[]>([]);

  const onGetSections = useCallback(
    (payload?: any) => {
      const params = getPaginationParams({ page: 1, pageSize: 10000 });
      const cacheKey = `${payload?.sort || filter?.sort}_${
        payload?.search || filter?.search
      }_${payload?.userId || filter?.userId}`;

      let isCacheKey = false;

      if (cacheLabels[cacheKey]) {
        isCacheKey = true;
        dispatch(actions.updateSections(cacheLabels[cacheKey]));
      } else {
        dispatch(
          actions.getSectionsRequest({
            params,
            filter: {
              ...filter,
              sort: payload?.sort || filter.sort,
              search: payload?.search || filter.search,
              showTags: filter?.showTags?.map(item => item.value),
              showGenres: filter?.showGenres?.map(item => item.value),
              showContributors: filter?.showContributors?.value,
              isCacheKey,
            },
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions, dispatch, filter],
  );

  const onGetMyLabel = useCallback(() => {
    dispatch(actions.getMyLabelRequest());
  }, [actions, dispatch]);

  const onGetSectionDetail = useCallback(
    labelId => {
      dispatch(actions.getSectionDetailRequest({ labelId }));
    },
    [actions, dispatch],
  );

  const onResetFilter = () => {
    setFilter(DEFAULT_FILTERS);
  };

  const handleChangeFilter = useCallback(
    (event, key, type = SLIDER_TYPE.DROPDOWN) => {
      if (type === SLIDER_TYPE.DROPDOWN) {
        setFilter(current => ({
          ...current,
          [key]: event,
        }));
      } else {
        const { name } = event.target;
        setFilter(current => ({
          ...current,
          [name]: !filter[name],
        }));
      }
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
          search: e.target.value,
        }));
      }, 500);
    },
    [setFilter],
  );

  useEffect(() => {
    setLabelTracks(sectionDetail?.tracks || []);
  }, [sectionDetail?.tracks]);

  const onSearchTracksInLabel = useCallback(
    e => {
      const { value = '' } = e.target;
      let result = sectionDetail?.tracks || [];

      if (value.toLowerCase().trim() !== '') {
        result = [...result].filter(item =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        );
      }

      setLabelTracks(result);
    },
    [sectionDetail?.tracks],
  );

  const getAllLabels = useCallback(() => {
    dispatch(actions.getAllLabelsRequest());
  }, [actions, dispatch]);

  const options = useMemo(
    () => [
      { _id: 1, title: 'ABOUT' },
      { _id: 2, title: 'TRACKS' },
      { _id: 3, title: 'RELEASES' },
      // { _id: 4, title: 'PLAYLISTS' },
      { _id: 4, title: 'CONTRIBUTORS' },
    ],
    [],
  );

  useEffect(() => {
    const query = queryString.parse(search);
    if (query && query.tab) {
      setTabIndex(+query.tab || 0);
    }
  }, [search]);

  return {
    sections,
    isLoading,
    sectionDetail,
    onGetSections,
    setFilter,
    handleChange,
    handleChangeFilter,
    onGetSectionDetail,
    onSearchTracksInLabel,
    labelTracks,
    filter,
    onResetFilter,
    onGetMyLabel,
    mySection,
    isOpen,
    setIsOpen,
    options,
    tabIndex,
    setTabIndex,
    setSearchValue,
    searchValue,
    topLabels,
    setSelectedTime,
    selectedTime,
    isLoadingTopLabels,
    getAllLabels,
    allLabels,
  };
};
