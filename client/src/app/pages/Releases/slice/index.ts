import { PayloadAction, current } from '@reduxjs/toolkit';
import { Release } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ReleasesSaga } from './saga';
import {
  ReleasesState,
  GetReleasesPayload,
  ReleasesResponse,
  CreateReleasePayload,
  ReleaseDetailsResponse,
  ReleasesResponses,
} from './types';

export const initialState: ReleasesState = {
  error: null,
  releases: [],
  isLoading: false,
  pagination: null,
  myReleases: [],
  release: null,
  releasesId: '',
  isFeaturesLoading: false,
  releasesByFeatures: [],
  isLoading7Days: false,
  releasesBy7Days: [],
  isCreateAtLoading: false,
  isEditReleaseSuccess: false,
  isCreateReleaseSuccess: false,
  releasesByCreateAt: [],
  totalPage: 1,
  currentPage: 0,
  topReleases: [],
  isLoadingRelease: false,
  listFiles: [],
  isLoadingMore: false,
  isStateRelease: false,
  isDeleteReleaseSuccess: false,
  isShowModalDeleteRelease: false,
};

const slice = createSlice({
  name: 'releases',
  initialState,
  reducers: {
    getReleasesRequest(state, action: PayloadAction<GetReleasesPayload>) {
      state.error = null;
      state.isLoading = true;
      state.isCreateReleaseSuccess = false;
      state.isEditReleaseSuccess = false;
      // const query: any = queryString.parse(action.payload?.params);
      // if (Number(query?.page) === 1) {
      //   state.currentPage = 0;
      // }
      // if (query?.page !== state.currentPage) {
      //   state.isLoadingMore = true;
      // }
    },
    getReleasesSuccess(state, action: PayloadAction<ReleasesResponses>) {
      state.isLoading = false;
      state.isLoadingMore = false;
      // if (action.payload.currentPage === 1) {
      //   state.releases = action.payload.data;
      // } else {
      //   state.releases = [...state.releases, ...action.payload.data];
      // }
      state.releases = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
    },
    getReleasesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingMore = false;
    },

    getTopReleasesRequest(
      state,
      action: PayloadAction<{ selectedTime: number }>,
    ) {
      state.error = null;
      state.topReleases = [];
      state.isLoading = true;
    },
    getTopReleasesSuccess(state, action: PayloadAction<Array<Release>>) {
      state.isLoading = false;
      state.topReleases = action.payload;
    },
    getTopReleasesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    setIsStateRelease(state, action: PayloadAction<boolean>) {
      state.isStateRelease = action.payload;
    },

    getFeaturesReleasesRequest(
      state,
      action: PayloadAction<GetReleasesPayload>,
    ) {
      state.isFeaturesLoading = true;
      state.releasesByFeatures = [];
      state.error = null;
      state.pagination = null;
    },
    getFeaturesReleasesSuccess(state, action: PayloadAction<ReleasesResponse>) {
      state.releasesByFeatures = action.payload.records;
      state.isFeaturesLoading = false;
      state.pagination = action.payload.pagination;
    },
    getFeaturesReleasesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isFeaturesLoading = false;
    },

    getReleaseBy7DaysRequest(state, action: PayloadAction<GetReleasesPayload>) {
      state.isLoading7Days = true;
      state.releasesBy7Days = [];
      state.error = null;
      state.pagination = null;
    },
    getReleaseBy7DaysSuccess(state, action: PayloadAction<ReleasesResponse>) {
      state.releasesBy7Days = action.payload.records;
      state.isLoading7Days = false;
      state.pagination = action.payload.pagination;
    },
    getReleaseBy7DaysFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading7Days = false;
    },

    getByCreateReleasesRequest(
      state,
      action: PayloadAction<GetReleasesPayload>,
    ) {
      state.isCreateAtLoading = true;
      state.releasesByCreateAt = [];
      state.error = null;
      state.pagination = null;
    },
    getByCreateReleasesSuccess(state, action: PayloadAction<ReleasesResponse>) {
      state.releasesByCreateAt = action.payload.records;
      state.isCreateAtLoading = false;
      state.pagination = action.payload.pagination;
    },
    getByCreateReleasesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isCreateAtLoading = false;
    },

    createReleaseRequest(state, action: PayloadAction<CreateReleasePayload>) {
      state.isLoading = true;
      state.isCreateReleaseSuccess = false;
      state.error = null;
    },
    createReleaseSuccess(state, action: PayloadAction<ReleaseDetailsResponse>) {
      state.isCreateReleaseSuccess = true;
      state.myReleases = [...state.myReleases, action.payload.release];
      state.releases = [action.payload.release, ...state.releases];
      state.isLoading = false;
    },
    createReleaseFailed(state, action: PayloadAction<string>) {
      state.isCreateReleaseSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    },

    updateReleaseRequest(state, action: PayloadAction<CreateReleasePayload>) {
      state.isLoading = true;
      state.isEditReleaseSuccess = false;
      state.error = null;
    },
    updateReleaseSuccess(state, action: PayloadAction<ReleaseDetailsResponse>) {
      const releaseIdxUpdated = state.releases.findIndex(
        release => release._id === action.payload.release?._id,
      );
      state.releases[releaseIdxUpdated] = action.payload.release;
      state.isEditReleaseSuccess = true;
      state.isLoading = false;
    },
    updateReleaseFailed(state, action: PayloadAction<string>) {
      state.isEditReleaseSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    },

    deleteReleaseRequest(state, action) {
      state.error = null;
      state.isDeleteReleaseSuccess = true;
    },
    deleteReleaseSuccess(state, action) {
      const releasesFiltered = (state.releases || []).filter(
        i => i?._id !== action.payload?._id,
      );
      state.isDeleteReleaseSuccess = false;
      state.isShowModalDeleteRelease = false;
      state.releases = releasesFiltered;
    },
    deleteReleaseFailed(state, action: PayloadAction<string>) {
      state.isDeleteReleaseSuccess = false;
      state.isShowModalDeleteRelease = false;
      state.error = action.payload;
    },

    setListFile(state, action: PayloadAction<any>) {
      state.listFiles = action.payload;
    },
    updateBelongMyWishlistRelease(state, action: PayloadAction<any>) {
      const releaseIdxUpdated = state.releases.findIndex(
        release => release._id === action.payload.releaseId,
      );
      const topReleaseIdxUpdated = state.topReleases.findIndex(
        release => release._id === action.payload.releaseId,
      );
      state.releases[releaseIdxUpdated] = {
        ...state.releases[releaseIdxUpdated],
        isBelongMyWishlist: action.payload.isBelongMyWishlist,
      };
      state.topReleases[topReleaseIdxUpdated] = {
        ...state.topReleases[topReleaseIdxUpdated],
        isBelongMyWishlist: action.payload.isBelongMyWishlist,
      };
    },
    updateTopReleases(state, action: PayloadAction<any>) {
      const trackIds = (action.payload || []).map(i => i?._id);
      const { topReleases, releases } = current(state);

      const updateTopRelease = topReleases.map((topRelease: any) => ({
        ...topRelease,
        tracks: (topRelease?.tracks || []).map(i => {
          if (trackIds.includes(i?._id)) {
            return {
              ...i,
              boughtByMe: true,
            };
          }
          return i;
        }),
      }));
      const updateRelease = releases.map((release: any) => ({
        ...release,
        tracks: (release?.tracks || []).map(i => {
          if (trackIds.includes(i?._id)) {
            return {
              ...i,
              boughtByMe: true,
            };
          }
          return i;
        }),
      }));
      state.topReleases = updateTopRelease;
      state.releases = updateRelease;
    },

    isShowModalDeleteRelease(state, action: PayloadAction<boolean>) {
      state.isShowModalDeleteRelease = action.payload;
    },
  },
});
export const { actions } = slice;
export const actionReleases = slice.actions;

export const useReleasesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ReleasesSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useReleasesSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
