import { PayloadAction } from '@reduxjs/toolkit';
import { DeleteTrackPayload } from 'app/apis/track/type';
import { TOKEN_MAX, TOKEN_MIN } from 'app/constants';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { Track } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { TrackSaga } from './saga';
import {
  BuyTrackPayload,
  TrackCreatePayload,
  TrackState,
  TracksPayload,
  TracksResponse,
} from './types';
import { socket } from 'app/contexts/WebsocketContext';
import { isEmpty } from 'ramda';
import { getLocalStorage } from 'app/helpers/local-storage';

export const initialState: TrackState = {
  isLoading: false,
  isLoadingDraftTracks: false,
  isLoadingDownloadZip: false,
  isDownloadingTrack: false,
  isSavingDropboxTrack: false,
  isLoadingCreateAt: false,
  tracks: [],
  myTracks: [],
  myTracksPurchased: [],
  error: null,
  pagination: null,
  trackUrl: '',
  isDownloadSuccess: false,
  trackIdDownloaded: '',
  featuredTracks: [],
  tracksByCreateAt: [],
  isLoadingFeaturedTrack: false,
  top10Tracks: [],
  isLoadingTop10Track: false,
  listTracks: [],
  totalPage: 1,
  currentPage: 1,
  resultsPerPage: 20,
  topTracks: [],
  listTracksUploadedSuccess: [],
  isLoadingMore: false,
  isShowFilter: false,
  tokenMax: TOKEN_MAX,
  tokenMin: TOKEN_MIN,
  filterTrack: undefined,
  isLoadingBuyTrack: false,
  isCheckOpenModelBuySubscription: false,
  myTracksStarPurchased: [],
  myDraftTracks: [],
  myAllTracksPurchased: [],
  myTracksSubscriptionPurchased: [],
  searchValue: '',
  isLoadingTrackMyLibrary: false,
  isUpdatingTrack: false,
  isUpdatingTrackSuccess: false,
  tabMyLibrary: '',
  buyTrackBySubSuccess: false,
  trackIdBuyBySub: null,
  isDownloadTrackSuccess: false,
  isFilterGlobalPageHome: false,
  btnFilters: {
    clean: isEmpty(getLocalStorage('clean')) || getLocalStorage('clean'),
    dirty: isEmpty(getLocalStorage('dirty')) || getLocalStorage('dirty'),
  },
  checkHideAndHiddenMyTrack: false,
  trackIdFavoritedAction: '',
  checkFavoritedAction: false,
  showFavoriteByMe: false,
};

const slice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    getTracksRequest(state, action: PayloadAction<TracksPayload>) {
      state.isLoading = true;
      state.error = null;
      state.pagination = null;
      // if (action.payload.filter.page === 1) {
      //   state.currentPage = 0;
      // }
      // if (action.payload.filter.page !== state.currentPage) {
      //   state.isLoadingMore = true;
      // }
    },
    getTracksSuccess(state, action: PayloadAction<TracksResponse>) {
      // if (action.payload.currentPage === 1) {
      //   state.tracks = action.payload.data;
      // } else {
      //   state.tracks = [...state.tracks, ...action.payload.data];
      // }
      state.tracks = action.payload.data;
      state.isLoading = false;
      state.isLoadingMore = false;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
    },
    changeResultsPerPage(state, action: PayloadAction<number>) {
      state.resultsPerPage = action.payload || 20;
    },
    getTracksFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingMore = false;
    },
    deleteTracksRequest(state, action: PayloadAction<DeleteTrackPayload>) {
      state.error = null;
    },
    deleteTracksSuccess(state, action: PayloadAction<Track>) {
      const filter = state.tracks.filter(i => i?._id !== action.payload.id);
      state.tracks = filter;
    },
    deleteTracksFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    getTokenMaxRequest(state) {
      state.error = null;
    },
    getTokenMaxSuccess(state, action: PayloadAction<any>) {
      state.tokenMax = action.payload?.maxPrice;
      state.tokenMin = action.payload?.minPrice;
    },

    updateGetTokenMaxSuccess(state, action) {
      const trackPrice = action.payload;
      if (trackPrice && state.tokenMax < trackPrice) {
        state.tokenMax = trackPrice;
      }
      if (trackPrice && state.tokenMin > trackPrice) {
        state.tokenMin = trackPrice;
      }
    },

    buyTracksofRelease(state, action: PayloadAction<any>) {
      const featuredTracks = state.featuredTracks;
      const tracksByCreateAt = state.tracksByCreateAt;
      const top10Tracks = state.top10Tracks;
      const listIdChange = action.payload.map(item => item._id);

      const handleUpdateTracks = list => {
        list.forEach((item, key) => {
          if (listIdChange.includes(item._id)) {
            const track = action.payload.find(value => item._id === value._id);
            list[key] = {
              ...list[key],
              boughtByMe: track.boughtByMe,
            };
          }
        });
      };
      handleUpdateTracks(featuredTracks);
      handleUpdateTracks(top10Tracks);
      handleUpdateTracks(tracksByCreateAt);
    },

    togglePlayOrPause(state, action: PayloadAction<any>) {
      const { trackID, isPlaying } = action.payload;
      state.tracks = [...state.tracks].map(tr => {
        tr.isPlaying = tr._id === trackID ? isPlaying : false;
        return tr;
      });
      state.top10Tracks = [...state.tracks].map(tr => {
        tr.isPlaying = tr._id === trackID ? isPlaying : false;
        return tr;
      });
    },

    buyTrackBySubscriptionRequest(state, action: PayloadAction<any>) {
      state.error = null;
      state.buyTrackBySubSuccess = true;
    },

    buyTrackBySubscriptionSuccess(state, action) {
      const trackIdx = (state?.tracks || []).findIndex(
        it => it?._id === action.payload.trackId,
      );
      if (trackIdx >= 0) {
        state.tracks[trackIdx] = {
          ...state.tracks[trackIdx],
          boughtByMe: true,
        };
      }
    },
    buyTrackBySubscriptionFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateTrackBySubscriptionRequest(state, action) {
      socket.emit('getPreSignUrlTrack', {
        data: {
          trackId: action.payload.trackId,
        },
        clientId: socket.id,
        userId: action.payload.userId,
        isBuyTrackWithSubscription: true,
      });
    },

    updateTrackBySubscriptionSuccess(state, action) {
      state.buyTrackBySubSuccess = action.payload;
    },

    buyTrackIdBySub(state, action: PayloadAction<any>) {
      state.trackIdBuyBySub = action.payload;
    },

    isFilterGlobalPageHome(state, action: PayloadAction<any>) {
      state.isFilterGlobalPageHome = action.payload;
    },

    updateIsDownloadTrackSuccess(state, action: PayloadAction<any>) {
      state.isDownloadTrackSuccess = action.payload;
    },

    updateTracksInReducer(state, action) {
      const { isBelongMyWishlist, data } = action.payload;
      const tracks = [...state.tracks] || [];
      data.forEach(wi => {
        const { track } = wi;
        const trackIdx = tracks.findIndex(it => it._id === track._id);
        tracks[trackIdx] = { ...tracks[trackIdx], isBelongMyWishlist };
      });
      state.tracks = tracks;
    },

    createTrackDraftRequest(state, action) {
      state.error = null;
    },
    createTrackDraftSuccess(state, action: PayloadAction<any>) {
      state.myDraftTracks = [action.payload, ...state.myDraftTracks];
    },

    getMyDraftTracksRequest(state, action) {
      state.error = null;
      state.isLoadingDraftTracks = true;
    },
    getMyDraftTracksSuccess(state, action: PayloadAction<TrackCreatePayload>) {
      state.myDraftTracks = action.payload;
      state.isLoadingDraftTracks = false;
    },

    deleteDraftTrackRequest(state, action) {
      state.error = null;
    },
    deleteDraftTracks(state, action: PayloadAction<any>) {
      const filter = state.myDraftTracks?.filter(
        track => !action.payload?.trackIds?.includes(track?._id),
      );
      state.myDraftTracks = filter;
    },

    updateListTracksUploadedSuccess(state, action) {
      state.listTracksUploadedSuccess = [
        ...state.listTracksUploadedSuccess,
        action.payload,
      ];
    },

    removeListTracksUploadedSuccess(state) {
      state.listTracksUploadedSuccess = [];
    },

    toggleShowFilter(state) {
      state.isShowFilter = !state.isShowFilter;
    },
    removeToggleShowFilter(state) {
      state.isShowFilter = false;
    },

    setShowFilter(state) {
      state.isShowFilter = true;
    },
    addFilterTrack(state, action: PayloadAction<any>) {
      state.filterTrack = action.payload;
    },

    setSearchValueSuccess(state, action: PayloadAction<any>) {
      state.searchValue = action.payload;
    },

    getMyAllTracksPurchasedRequest(state, action: PayloadAction<any>) {
      state.isLoadingTrackMyLibrary = true;
      state.error = null;
    },
    getMyAllTracksPurchasedSuccess(
      state,
      action: PayloadAction<TracksResponse>,
    ) {
      state.myAllTracksPurchased = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },
    getMyAllTracksPurchasedFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },

    getMyTracksPurchasedRequest(state, action: PayloadAction<any>) {
      state.isLoadingTrackMyLibrary = true;
      state.error = null;
    },
    getMyTracksPurchasedSuccess(state, action: PayloadAction<TracksResponse>) {
      state.myTracksPurchased = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },
    getMyTracksPurchasedFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },

    updateMyTracksPurchasedWithZip(state, action: PayloadAction<any>) {
      state.myTracksPurchased.forEach((item, index) => {
        action.payload.forEach((itemPayload, indexPayload) => {
          const trackIdx = item.listTracksPurchased.findIndex(
            it => it._id === itemPayload.trackId,
          );
          state.myTracksPurchased[index].listTracksPurchased[trackIdx] = {
            ...state.myTracksPurchased[index].listTracksPurchased[trackIdx],
            numberDownloads: action.payload[indexPayload].numberDownloads,
          };
        });
      });
    },

    updateIsLoadingDownloadZip(state, action: PayloadAction<any>) {
      state.isLoadingDownloadZip = action.payload;
    },

    buyTrackByStarRequest(state, action: PayloadAction<BuyTrackPayload>) {
      state.error = null;
      state.isLoadingBuyTrack = true;
    },
    buyTrackByStarSuccess(state, action: PayloadAction<any>) {
      toastSuccess('Success');
      state.isLoadingBuyTrack = false;
      const { _id } = action.payload;
      const trackIdx = state.tracks.findIndex(it => it._id === _id);
      state.tracks[trackIdx] = {
        ...state.tracks[trackIdx],
        boughtByMe: true,
      };
    },
    buyTrackByStarFailed(state, action: PayloadAction<string>) {
      toastError(action.payload);
      state.isLoadingBuyTrack = true;
    },

    setIsCheckOpenModelBuySubscription(state, action) {
      state.isCheckOpenModelBuySubscription = action.payload;
    },

    getMyTracksStarPurchasedRequest(state, action: PayloadAction<any>) {
      state.isLoadingTrackMyLibrary = true;
      state.error = null;
    },
    getMyTracksStarPurchasedSuccess(
      state,
      action: PayloadAction<TracksResponse>,
    ) {
      state.myTracksStarPurchased = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },
    getMyTracksStarPurchasedFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },
    getMyTracksSubscriptionPurchasedRequest(state, action: PayloadAction<any>) {
      state.isLoadingTrackMyLibrary = true;
      state.error = null;
    },
    getMyTracksSubscriptionPurchasedSuccess(
      state,
      action: PayloadAction<TracksResponse>,
    ) {
      state.myTracksSubscriptionPurchased = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },
    getMyTracksSubscriptionPurchasedFailed(
      state,
      action: PayloadAction<string>,
    ) {
      state.error = action.payload;
      state.isLoadingTrackMyLibrary = false;
    },

    updateIsDownloadingTrack(state, action: PayloadAction<any>) {
      state.isDownloadingTrack = action.payload.isDownloadingTrack;
    },

    updateIsSavingDropboxTrack(state, action: PayloadAction<any>) {
      state.isSavingDropboxTrack = action.payload.isSavingDropboxTrack;
    },

    setIsUpdatingTrack(state, action: PayloadAction<any>) {
      state.isUpdatingTrack = action.payload.isUpdatingTrack;
    },

    setIsUpdatingTrackSuccess(state, action: PayloadAction<any>) {
      state.isUpdatingTrackSuccess = action.payload.isUpdatingTrackSuccess;
    },

    updateTrackRequest(state, action: PayloadAction<any>) {
      state.error = null;
      state.isUpdatingTrackSuccess = false;
    },
    updateTrackSuccess(state, action: PayloadAction<any>) {
      state.isUpdatingTrack = false;
      state.isUpdatingTrackSuccess = true;
      toastSuccess('Update successfully!');
    },
    updateTrackFailed(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.isUpdatingTrack = false;
      state.isUpdatingTrackSuccess = false;
      toastError(action?.payload?.response?.data?.message);
    },

    updateNumberDownloadTrackRequest(state, action: PayloadAction<any>) {
      state.error = null;
    },
    updateNumberDownloadTrackSuccess(state, action: PayloadAction<any>) {
      state.isDownloadingTrack = false;
      const trackIdx = state.myTracksStarPurchased.findIndex(
        it => it._id === action.payload.trackId,
      );
      state.myTracksStarPurchased[trackIdx] = {
        ...state.myTracksStarPurchased[trackIdx],
        numberDownloads: action.payload.numberDownloads,
      };

      state.myTracksPurchased.forEach((item, index) => {
        const trackIdx = item.listTracksPurchased.findIndex(
          it => it._id === action.payload.trackId,
        );
        state.myTracksPurchased[index].listTracksPurchased[trackIdx] = {
          ...state.myTracksPurchased[index].listTracksPurchased[trackIdx],
          numberDownloads: action.payload.numberDownloads,
        };
      });

      const trackAllIdx = state.myAllTracksPurchased.findIndex(
        it => it._id === action.payload.trackId,
      );
      state.myAllTracksPurchased[trackAllIdx] = {
        ...state.myAllTracksPurchased[trackAllIdx],
        numberDownloads: action.payload.numberDownloads,
      };
    },
    updateNumberDownloadTrackFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateTabMyLibrary(state, action: PayloadAction<string>) {
      state.tabMyLibrary = action.payload;
    },

    updateBtnFilters(state, action: PayloadAction<any>) {
      state.btnFilters = action.payload;
    },

    updateTextHideAndHiddenMyTrack(state, action) {
      const trackIdx = (state?.tracks || []).findIndex(
        it => it?._id === action.payload?.data._id,
      );
      if (trackIdx >= 0) {
        state.tracks[trackIdx] = {
          ...state.tracks[trackIdx],
          disabledByUser: action.payload?.data.disabledByUser,
        };
      }
      state.checkHideAndHiddenMyTrack = !state.checkHideAndHiddenMyTrack;
      state.tracks = state.tracks.filter(
        track => track._id !== action.payload?.data._id,
      );
    },
    updateFavoritedTrackRequest(state, action) {
      state.error = null;
    },

    updateFavoritedTrack(state, action) {
      const trackIdx = (state?.tracks || []).findIndex(
        it => it?._id === action.payload?.trackId,
      );
      if (trackIdx >= 0) {
        state.tracks[trackIdx] = {
          ...state.tracks[trackIdx],
          favoriteByMe: !state.tracks[trackIdx].favoriteByMe,
        };
      }
      state.trackIdFavoritedAction = action.payload?.trackId;
      state.checkFavoritedAction = !state.checkFavoritedAction;

      if (state.showFavoriteByMe) {
        state.tracks = state.tracks.filter(track => track.favoriteByMe);
      }
    },
    updateShowFavoriteByMe(state, action) {
      state.showFavoriteByMe = action.payload;
    },
  },
});

export const { actions } = slice;
export const actionsTracks = slice.actions;
export const useTrackSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: TrackSaga });
  return { actions: slice.actions };
};
