import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ReleaseDetailSaga } from './saga';
import {
  ReleaseDetailsPayload,
  ReleaseDetailsResponse,
  ReleaseDetailState,
} from './types';

export const initialState: ReleaseDetailState = {
  releaseDetail: null,
  isLoading: false,
  error: null,
  tracksByReleaseId: [],
  releasesUser: [],
  isLoadingTrack: false,
  isLoadingTrackByReleaseId: false,
};

const slice = createSlice({
  name: 'releaseDetail',
  initialState,
  reducers: {
    getReleaseDetailRequest(
      state,
      action: PayloadAction<ReleaseDetailsPayload>,
    ) {
      state.isLoading = true;
      state.releaseDetail = null;
      state.error = null;
    },
    getReleaseDetailSuccess(
      state,
      action: PayloadAction<ReleaseDetailsResponse>,
    ) {
      state.isLoading = false;
      state.releaseDetail = action.payload;
    },
    getReleaseDetailFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    // buy track

    getAllTrackByReleaseIdRequest(
      state,
      action: PayloadAction<{ _id: string; sort?: string }>,
    ) {
      state.isLoadingTrackByReleaseId = true;
      state.tracksByReleaseId = [];
      state.error = null;
    },
    getAllTrackByReleaseIdSuccess(state, action: PayloadAction<any>) {
      state.isLoadingTrackByReleaseId = false;
      state.tracksByReleaseId = action.payload;
    },
    updateAllTrackByReleaseId(state, action: PayloadAction<any>) {
      state.tracksByReleaseId = state.tracksByReleaseId.map(item => {
        return {
          ...item,
          boughtByMe: true,
        };
      });
    },
    getAllTrackByReleaseIdFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoadingTrackByReleaseId = false;
    },

    releaseDetailActionFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateTrackByPlaylistIdInReducer(state, action) {
      const { isBelongMyWishlist, data } = action.payload;
      const tracks = [...state.tracksByReleaseId] || [];
      data.forEach(wi => {
        const { track } = wi;
        const trackIdx = tracks.findIndex(it => it._id === track._id);
        tracks[trackIdx] = { ...tracks[trackIdx], isBelongMyWishlist };
      });
      state.tracksByReleaseId = tracks;
    },
    updateReleaseByIdInReducer(state, action) {
      state.releaseDetail = {
        ...state.releaseDetail,
        isBelongMyWishlist: false,
      };
    },

    addReleaseByIdInReducer(state, action) {
      state.releaseDetail = {
        ...state.releaseDetail,
        isBelongMyWishlist: true,
      };
    },

    updatePriceReleaseDetailSuccess(state, action: PayloadAction<any>) {
      const releaseIds: any = action.payload?.releaseIds || [];
      const trackIds: any = action.payload.listTracks.map(tr => tr?._id);
      const isBoughtBuy =
        (releaseIds || []).includes(state?.releaseDetail?._id) ||
        (state?.releaseDetail?.tracks || []).every(tr =>
          trackIds.includes(tr?._id),
        );

      state.releaseDetail = {
        ...state.releaseDetail,
        boughtByMe: isBoughtBuy,
      };
    },
  },
});

export const { actions } = slice;
export const actionsReleases = slice.actions;
export const actionsReleaseDetail = slice.actions;
export const useReleaseDetailSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ReleaseDetailSaga });
  return { actions: slice.actions };
};
