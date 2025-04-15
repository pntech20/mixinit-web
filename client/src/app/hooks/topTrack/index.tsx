import { useDisclosure } from '@chakra-ui/react';
import { getTopTrackDetail } from 'app/apis/top10Lits';
import { buyTrackByStar, buyTrackBySubscriptionApi } from 'app/apis/track';
import { DATE_RANGE } from 'app/constants/enum';
import { socket } from 'app/contexts/WebsocketContext';
import { toastError, toastSuccess, toastWarning } from 'app/helpers/toast';
import { actionsAuth } from 'app/pages/Login/slice';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import { actionsWishlists } from 'app/pages/Wishlist/slice';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFilters } from '../filters/userFilters';
import { useSections } from '../sections/useSections';
import { getLocalStorage, setLocalStorage } from 'app/helpers/local-storage';
import { isEmpty } from 'ramda';

export const useTopTrack = () => {
  const [selectedTime, setSelectedTime] = useState(DATE_RANGE.LAST_30_DAYS);
  const { userDetail } = useSelector(selectAuth);
  const { actions } = useTrackSlice();
  const [visibleTracksIndex, setVisibleTracksIndex] = useState<any>({});
  const [loadingIndexes, setLoadingIndexes] = useState<any>([]);
  const [itemData, setItemData] = useState({});
  const [trackId, setTrackId] = useState<any>();
  const { sortByOptionsLabel } = useFilters();
  const [tab, setTab] = useState<number>(1);
  const { sections = [] } = useSections();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name@asc');
  const [labelId, setLabelId] = useState('');

  const {
    trackIdBuyBySub,
    isDownloadTrackSuccess,
    isFilterGlobalPageHome,
    trackIdFavoritedAction,
    checkFavoritedAction,
  } = useSelector(selectSliceTracks);

  const [isLoadingBuyTrackPageChart, setisLoadingBuyTrackPageChart] =
    useState<boolean>(false);

  const {
    isOpen: isShowModalBuyTrackByStarPageChart,
    onOpen: onOpenModalBuyTrackByStarPageChart,
    onClose: onCloseModalBuyTrackByStarPageChart,
  } = useDisclosure();

  const {
    isOpen: isShowModalBuyTrackBySubPageChart,
    onOpen: onOpenModalBuyTrackBySubPageChart,
    onClose: onCloseModalBuyTrackBySubPageChart,
  } = useDisclosure();

  const handleOpenBuyTrack = id => {
    setTrackId(id);
    onOpenModalBuyTrackByStarPageChart();
  };

  const isShowMessDownloadSubStorage = getLocalStorage('isShowDownloadSub');
  const isShowMessDownloadSub = isEmpty(isShowMessDownloadSubStorage)
    ? true
    : isShowMessDownloadSubStorage;

  const onChange = useCallback(e => {
    if (e.target.checked)
      toastWarning('You can reset all warnings in your account settings.');
    setLocalStorage('isShowDownloadSub', !e.target.checked);
  }, []);

  const handleOpenBuyTrackBySub = id => {
    setTrackId(id);
    !isShowMessDownloadSub
      ? buyTrackBySubPageChart(id)
      : onOpenModalBuyTrackBySubPageChart();
  };

  const handleFilter = useCallback(
    (key, value) => {
      key === 'search' && setSearch(key);
      key === 'sort' && setSort(value);
      key === 'labelId' && setLabelId(value);
    },
    [setLabelId, setSearch, setSort],
  );

  const handleChange = e => {
    setSearch(e.target.value);
  };

  const handleClick = useCallback(
    async (id, newTime, index, key, labelId) => {
      const dataKey = `${index}-${newTime}`;
      if (visibleTracksIndex[dataKey]) {
        setVisibleTracksIndex(prevVisibleTracks => ({
          ...prevVisibleTracks,
          [dataKey]: null,
        }));
      } else {
        setVisibleTracksIndex(prevVisibleTracks => ({
          ...prevVisibleTracks,
          [dataKey]: id,
        }));
        if (!itemData[dataKey]) {
          setLoadingIndexes(prevLoadingIndexes => [
            ...prevLoadingIndexes,
            dataKey,
          ]);
          const data = {
            clean: true,
            dirty: true,
            labelId,
            dateRange: newTime,
          };
          const result = await getTopTrackDetail(id, key, data);

          setItemData(prevData => ({
            ...prevData,
            [dataKey]: result,
          }));
          setLoadingIndexes(prevLoadingIndexes =>
            prevLoadingIndexes.filter(i => i !== dataKey),
          );
        }
      }
    },
    [itemData, visibleTracksIndex],
  );

  const dispatch = useDispatch();

  const buyTrackByStarPageChart = async trackId => {
    setisLoadingBuyTrackPageChart(true);
    const res: any = await buyTrackByStar(trackId);
    setItemData(prevData => {
      const newData = { ...prevData };
      for (let key in newData) {
        newData[key] = newData[key].map(item =>
          item._id === trackId ? { ...item, boughtByMe: true } : item,
        );
      }
      return newData;
    });
    toastSuccess('Success');
    dispatch(
      actionsAuth.updateUserInReducer({
        starsRemaining: res?.starsRemaining || 0,
      }),
    );
    dispatch(
      actionsWishlists.updateTrackandReleaseinWishlistsInReducer([
        {
          _id: trackId,
        },
      ]),
    );

    onCloseModalBuyTrackByStarPageChart();
    setisLoadingBuyTrackPageChart(false);
  };
  const buyTrackBySubPageChart = async trackId => {
    onCloseModalBuyTrackBySubPageChart();
    dispatch(actions.buyTrackIdBySub(trackId));
    dispatch(actions.updateTrackBySubscriptionSuccess(true));
    const res: any = await buyTrackBySubscriptionApi({ trackId });

    if (res?.url) {
      socket.emit('getPreSignUrlTrack', {
        data: {
          trackId,
        },
        clientId: socket.id,
        userId: userDetail._id,
        isBuyTrackWithSubscription: true,
        isBuyTopTrackWithSubscription: true,
      });
    } else {
      toastError('Buy track failed');
    }
  };

  const handleTimeChange = useCallback(
    (newTime, labelId, item) => {
      setSelectedTime(newTime);
      Object.keys(visibleTracksIndex).forEach(dataKey => {
        const [index] = dataKey.split('-');
        const newKey = `${index}-${newTime}`;
        if (visibleTracksIndex[dataKey] && !itemData[newKey]) {
          setVisibleTracksIndex(prevVisibleTracks => ({
            ...prevVisibleTracks,
            [newKey]: visibleTracksIndex[dataKey],
          }));
          setLoadingIndexes(prevLoadingIndexes => [
            ...prevLoadingIndexes,
            newKey,
          ]);
          const data = {
            clean: true,
            dirty: true,
            labelId,
            dateRange: newTime,
          };
          getTopTrackDetail(visibleTracksIndex[dataKey], item, data).then(
            result => {
              setItemData(prevData => ({
                ...prevData,
                [newKey]: result,
              }));
              setLoadingIndexes(prevLoadingIndexes =>
                prevLoadingIndexes.filter(i => i !== newKey),
              );
            },
          );
        }
      });
    },
    [itemData, visibleTracksIndex],
  );

  useEffect(() => {
    if (isDownloadTrackSuccess && trackIdBuyBySub) {
      setItemData(prevData => {
        const newData = { ...prevData };
        for (let key in newData) {
          newData[key] = newData[key].map(item =>
            item._id === trackIdBuyBySub ? { ...item, boughtByMe: true } : item,
          );
        }
        return newData;
      });
      dispatch(actions.updateIsDownloadTrackSuccess(false));
    }
  }, [actions, dispatch, isDownloadTrackSuccess, trackIdBuyBySub]);

  const updateWishlistStatus = (trackId, isBelong) => {
    setItemData(prevData => {
      const newData = { ...prevData };
      for (let key in newData) {
        newData[key] = newData[key].map(item =>
          item._id === trackId
            ? { ...item, isBelongMyWishlist: !isBelong }
            : item,
        );
      }
      return newData;
    });
  };

  useEffect(() => {
    if (trackIdFavoritedAction) {
      setItemData(prevData => {
        const updatedData = { ...prevData };

        for (const key in updatedData) {
          if (Array.isArray(updatedData[key])) {
            updatedData[key] = updatedData[key].map(item =>
              item._id === trackIdFavoritedAction
                ? { ...item, favoriteByMe: !item.favoriteByMe }
                : item,
            );
          }
        }

        return updatedData;
      });
    }
  }, [checkFavoritedAction, trackIdFavoritedAction]);

  return {
    setSelectedTime,
    selectedTime,
    updateWishlistStatus,
    isShowModalBuyTrackByStarPageChart,
    onOpenModalBuyTrackByStarPageChart,
    onCloseModalBuyTrackByStarPageChart,
    isShowModalBuyTrackBySubPageChart,
    onOpenModalBuyTrackBySubPageChart,
    onCloseModalBuyTrackBySubPageChart,
    isLoadingBuyTrackPageChart,
    buyTrackByStarPageChart,
    buyTrackBySubPageChart,
    dispatch,
    actions,
    isFilterGlobalPageHome,
    visibleTracksIndex,
    setVisibleTracksIndex,
    setItemData,
    handleClick,
    loadingIndexes,
    itemData,
    handleOpenBuyTrack,
    handleOpenBuyTrackBySub,
    trackId,
    sortByOptionsLabel,
    sections,
    tab,
    setTab,
    search,
    setSearch,
    sort,
    setSort,
    labelId,
    setLabelId,
    handleFilter,
    handleChange,
    handleTimeChange,
    setTrackId,
    onChange,
  };
};
