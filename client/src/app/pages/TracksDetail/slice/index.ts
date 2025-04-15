import { PayloadAction } from '@reduxjs/toolkit';
import { TrackDetailsPayload } from 'app/apis/track/type';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { TrackDetailSaga } from './saga';
import {
  RelatedTrackDetailResponse,
  ReleasesTrackDetailResponse,
  TrackDetailResponse,
  TrackDetailState,
} from './types';

export const initialState: TrackDetailState = {
  isLoading: false,
  error: null,
  trackInfo: null,
  relatedTracks: null,
  releases: null,
};

const slice = createSlice({
  name: 'trackDetail',
  initialState,
  reducers: {
    getTrackDetailRequest(state, action: PayloadAction<TrackDetailsPayload>) {
      state.isLoading = true;
      state.trackInfo = null;
      state.error = null;
    },
    getTrackDetailSuccess(state, action: PayloadAction<TrackDetailResponse>) {
      state.isLoading = false;
      state.trackInfo = action.payload.trackInfo;
    },
    getTrackDetailFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    getRelatedTrackDetailRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.relatedTracks = null;
      state.error = null;
    },
    getRelatedTrackDetailSuccess(
      state,
      action: PayloadAction<RelatedTrackDetailResponse>,
    ) {
      state.isLoading = false;
      state.relatedTracks = action.payload.relatedTracks;
    },
    getRelatedTrackDetailFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    getReleasesTrackDetailRequest(
      state,
      action: PayloadAction<TrackDetailsPayload>,
    ) {
      state.isLoading = true;
      state.releases = null;
      state.error = null;
    },
    getReleasesTrackDetailSuccess(
      state,
      action: PayloadAction<ReleasesTrackDetailResponse>,
    ) {
      state.isLoading = false;
      state.releases = action.payload.releases;
    },
    getReleasesTrackDetailFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateStateTrackDetail(state, action) {
      state = {
        ...state,
        trackInfo: {
          ...state?.trackInfo,
          ...action.payload,
        },
      };
    },
    updateFavoriteInTrackDetails(state, action) {
      state.trackInfo = {
        ...state.trackInfo,
        favoriteByMe: !state.trackInfo.favoriteByMe,
      };

      const trackIdx = (state?.relatedTracks || []).findIndex(
        it => it?._id === action.payload?.trackId,
      );
      if (trackIdx >= 0) {
        state.relatedTracks[trackIdx] = {
          ...state.relatedTracks[trackIdx],
          favoriteByMe: !state.relatedTracks[trackIdx].favoriteByMe,
        };
      }
    },
    updateStateRelatedTrackDetail(state, action) {
      const relatedTrackIdx =
        state?.relatedTracks?.findIndex(it => it._id === action.payload._id) ||
        -1;
      if (relatedTrackIdx >= 0) {
        state.relatedTracks[relatedTrackIdx] = {
          ...state.relatedTracks[relatedTrackIdx],
          isBelongMyWishlist: action.payload.isBelongMyWishlist,
        };
      }
    },
    buyTrackBySubscriptionSuccess(state, action) {
      if (state?.trackInfo?._id) {
        state.trackInfo =
          state?.trackInfo?._id === action.payload.trackId
            ? {
                ...state?.trackInfo,
                boughtByMe: true,
              }
            : state?.trackInfo;
        const relatedTracksIdx = (state.relatedTracks || []).findIndex(
          it => it?._id === action.payload.trackId,
        );
        state.relatedTracks[relatedTracksIdx] = {
          ...state?.relatedTracks[relatedTracksIdx],
          boughtByMe: true,
        };
      }
    },

    updateStateTrackAndTrackOfReleaseAndTrackOfPlaylist(state, action) {
      const trackIds = action.payload.map(i => i?._id);
      const isBoughtBuyTrack = trackIds.includes(state?.trackInfo?._id);

      state = {
        ...state,
        trackInfo: {
          ...state?.trackInfo,
          boughtByMe: isBoughtBuyTrack,
        },
        relatedTracks: (state?.relatedTracks || []).map(relatedTrack => {
          const isBoughtBuyTrackOfRelatedTrack = trackIds.includes(
            relatedTrack?._id,
          );
          return {
            ...relatedTrack,
            boughtByMe: isBoughtBuyTrackOfRelatedTrack,
          };
        }),
        releases: (state?.releases || []).map(release => {
          const isBoughtBuyTrackOfRelease = (release?.tracks || []).every(tr =>
            trackIds.includes(tr?._id),
          );
          return {
            ...release,
            boughtByMe: isBoughtBuyTrackOfRelease,
          };
        }),
      };
    },
  },
});

export const { actions } = slice;
export const actionsTrackDetail = slice.actions;
export const useTrackDetailSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: TrackDetailSaga });
  return { actions: slice.actions };
};
