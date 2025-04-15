import { useDisclosure } from '@chakra-ui/react';
import { downloadFromMultipleUrls } from 'app/apis/track';
import { MY_LIBRARY_TABS, SORT_TYPE } from 'app/constants/enum';
import downloadFromZip from 'app/helpers/download/downloadFromzip';
import { toastError } from 'app/helpers/toast';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';

export const useMyLibrary = () => {
  const { actions } = useTrackSlice();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const timeoutRef = useRef<any>(null);

  const [searchValue, setSearchValue] = useState('');
  const [selectedTab, setSelectedTab] = useState(MY_LIBRARY_TABS.ALL_PURCHASE);

  const isMyLibraryStar = selectedTab === MY_LIBRARY_TABS.STAR_PURCHASE;
  const isMyLibrarySubscription =
    selectedTab === MY_LIBRARY_TABS.SUBSCRIPTION_PURCHASE;
  const isMyLibraryCash = selectedTab === MY_LIBRARY_TABS.CASH_PURCHASE;

  const isMyLibraryAll = selectedTab === MY_LIBRARY_TABS.ALL_PURCHASE;

  const initialFilter = useMemo(() => {
    return {
      sort: SORT_TYPE.CREATED_AT_PURCHASE_DESC,
      search: '',
    };
  }, []);

  const [filter, setFilter] = useState(initialFilter);

  const {
    myTracksPurchased,
    myTracksStarPurchased,
    isLoadingTrackMyLibrary,
    isLoadingDownloadZip,
    myAllTracksPurchased,
    myTracksSubscriptionPurchased,
  } = useSelector(selectSliceTracks);

  useEffect(() => {
    setSearchValue('');
    setFilter(initialFilter);
    dispatch(actions.setSearchValueSuccess(''));
  }, [actions, dispatch, initialFilter, selectedTab]);

  const handleSearch = useCallback(
    value => {
      setSearchValue(value);
      dispatch(actions.setSearchValueSuccess(value));
      const data = {
        // showAudio:
        //   isEmpty(getLocalStorage('showAudio')) || getLocalStorage('showAudio'),
        // showVideo:
        //   isEmpty(getLocalStorage('showVideo')) || getLocalStorage('showVideo'),
        clean: true,
        dirty: true,
      };

      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setTimeout(() => {
          const payload = value;
          switch (selectedTab) {
            case MY_LIBRARY_TABS.ALL_PURCHASE:
              dispatch(
                actions.getMyAllTracksPurchasedRequest({
                  ...filter,
                  search: payload,
                  data,
                }),
              );
              break;
            case MY_LIBRARY_TABS.CASH_PURCHASE:
              dispatch(
                actions.getMyTracksPurchasedRequest({
                  ...filter,
                  search: payload,
                  data,
                }),
              );
              break;
            case MY_LIBRARY_TABS.STAR_PURCHASE:
              dispatch(
                actions.getMyTracksStarPurchasedRequest({
                  ...filter,
                  search: payload,
                  data,
                }),
              );
              break;
            case MY_LIBRARY_TABS.SUBSCRIPTION_PURCHASE:
              dispatch(
                actions.getMyTracksSubscriptionPurchasedRequest({
                  ...filter,
                  search: payload,
                }),
              );
              break;
          }
        }, 1000);
      }, 1000);
    },
    [actions, dispatch, filter, selectedTab],
  );

  const onGetMyTracksPurchased = useCallback(() => {
    dispatch(actions.updateTabMyLibrary('myTracksPurchased'));
    dispatch(
      actions.getMyTracksPurchasedRequest({
        ...filter,
        data: {
          // showAudio:
          //   isEmpty(getLocalStorage('showAudio')) ||
          //   getLocalStorage('showAudio'),
          // showVideo:
          //   isEmpty(getLocalStorage('showVideo')) ||
          //   getLocalStorage('showVideo'),
          clean: true,
          dirty: true,
        },
      }),
    );
  }, [actions, dispatch, filter]);

  const onGetMyAllTracksPurchased = useCallback(() => {
    dispatch(actions.updateTabMyLibrary('myAllTracksPurchased'));
    dispatch(
      actions.getMyAllTracksPurchasedRequest({
        ...filter,
        data: {
          // showAudio:
          //   isEmpty(getLocalStorage('showAudio')) ||
          //   getLocalStorage('showAudio'),
          // showVideo:
          //   isEmpty(getLocalStorage('showVideo')) ||
          //   getLocalStorage('showVideo'),
          clean: true,
          dirty: true,
        },
      }),
    );
  }, [actions, dispatch, filter]);

  const onGetMyTracksSubscriptionPurchased = useCallback(() => {
    dispatch(actions.updateTabMyLibrary('myTracksSubscriptionPurchased'));
    dispatch(
      actions.getMyTracksSubscriptionPurchasedRequest({
        ...filter,
        data: {
          // showAudio:
          //   isEmpty(getLocalStorage('showAudio')) ||
          //   getLocalStorage('showAudio'),
          // showVideo:
          //   isEmpty(getLocalStorage('showVideo')) ||
          //   getLocalStorage('showVideo'),
          clean: true,
          dirty: true,
        },
      }),
    );
  }, [actions, dispatch, filter]);

  const onGetMyTracksStarPurchased = useCallback(() => {
    dispatch(actions.updateTabMyLibrary('myTracksStarPurchased'));

    dispatch(
      actions.getMyTracksStarPurchasedRequest({
        ...filter,
        data: {
          // showAudio:
          //   isEmpty(getLocalStorage('showAudio')) ||
          //   getLocalStorage('showAudio'),
          // showVideo:
          //   isEmpty(getLocalStorage('showVideo')) ||
          //   getLocalStorage('showVideo'),
          clean: true,
          dirty: true,
        },
      }),
    );
  }, [actions, dispatch, filter]);

  async function handleZip(item) {
    const data = item.listTracksPurchased.filter(i => i.numberDownloads > 0);

    const trackIds = data.map(track => track._id);

    if (trackIds.length > 0) {
      dispatch(actions.updateIsLoadingDownloadZip(true));
      const datadownload: any = await downloadFromMultipleUrls({ trackIds });
      if (datadownload) {
        dispatch(actions.updateMyTracksPurchasedWithZip(datadownload));
        const newDataUrl = datadownload.map(i => i.url);
        const zip = new JSZip();

        for (let i = 0; i < newDataUrl.length; i++) {
          const response = await fetch(newDataUrl[i]);
          const blob = await response.blob();
          const nameFile =
            item.listTracksPurchased[i].artist +
            ' - ' +
            item.listTracksPurchased[i].title;

          zip.file(
            `${nameFile.split('/').join(' - ')}.${
              item.listTracksPurchased[i].type === 'audio' && 'mp3'
            }`,
            blob,
          );
          if (i === newDataUrl.length - 1) {
            onClose();
            dispatch(actions.updateIsLoadingDownloadZip(false));
          }
        }

        const zipData = await zip.generateAsync({
          type: 'blob',
          streamFiles: true,
        });

        const nameFile = `Order: ${item.orderId}.zip`;
        downloadFromZip(zipData, nameFile);
      }
    } else {
      toastError('You have run out of downloads');
      onClose();
      dispatch(actions.updateIsLoadingDownloadZip(false));
    }
  }

  return {
    myTracksPurchased,
    isLoadingTrackMyLibrary,
    handleSearch,
    setSearchValue,
    searchValue,
    handleZip,
    isLoadingDownloadZip,
    isOpen,
    onOpen,
    onClose,
    myTracksStarPurchased,
    myTracksSubscriptionPurchased,
    isMyLibraryStar,
    selectedTab,
    setSelectedTab,
    myAllTracksPurchased,
    isMyLibrarySubscription,
    isMyLibraryCash,
    isMyLibraryAll,
    filter,
    setFilter,
    onGetMyTracksSubscriptionPurchased,
    onGetMyTracksStarPurchased,
    onGetMyAllTracksPurchased,
    onGetMyTracksPurchased,
  };
};
