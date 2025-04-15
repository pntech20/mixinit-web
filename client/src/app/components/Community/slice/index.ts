import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { communitySaga } from './saga';
import {
  CommunityPayload,
  CommunitysResponse,
  CommunityState,
  ToggleBlockUserPayload,
} from './types';

export const initialState: CommunityState = {
  isLoading: false,
  users: [],
  contributors: [],
  error: null,
  pagination: null,
  isLoadingFollow: false,
  isLoadingMore: false,
  currentPage: 0,
  totalPage: 1,
  isLoadingTopContributor: false,
  topContributors: [],
  topContributorsCache: {},
};

const slice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    getCommunityRequest(state, action: PayloadAction<CommunityPayload>) {
      state.isLoading = true;
      // if (action.payload.filter.page === 1) {
      //   state.currentPage = 0;
      // }
      // if (action.payload.filter.page !== state.currentPage) {
      //   state.isLoadingMore = true;
      // }
    },
    getCommunitySuccess(state, action: PayloadAction<CommunitysResponse>) {
      state.isLoading = false;
      state.isLoadingMore = false;
      // if (action.payload.currentPage === 1) {
      //   state.users = action.payload.data;
      // } else {
      //   state.users = [...state.users, ...action.payload.data];
      // }
      state.users = action.payload.data;
      state.totalPage = action.payload.totalPage;
      state.currentPage = action.payload.currentPage;
    },

    getTopCommunityRequest(state, action: PayloadAction<CommunityPayload>) {
      state.isLoadingTopContributor = true;
    },
    getTopCommunitySuccess(state, action: PayloadAction<CommunitysResponse>) {
      state.isLoadingTopContributor = false;
      state.topContributors = action.payload.data;
      const cacheKey = `${action.payload?.filter.sort}_${action.payload.filter.labelId}`;
      state.topContributorsCache[cacheKey] = action.payload.data;
    },
    getTopCommunityFailed(state, action: PayloadAction<string>) {
      state.isLoadingTopContributor = false;
      state.error = action.payload;
    },
    updateTopContributor(state, action: any) {
      state.topContributors = action.payload;
    },
    getContributorsRequest(state) {},
    getContributorsSuccess(state, action) {
      state.contributors = action.payload;
    },
    getCommunityFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoadingMore = false;
    },

    removeUserBlock(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.users = state.users.filter(user => user._id !== id);
    },
    toggleBlockUserRequest(
      state,
      action: PayloadAction<ToggleBlockUserPayload>,
    ) {
      state.error = null;
    },
    toggleBlockUserSuccess(
      state,
      action: PayloadAction<ToggleBlockUserPayload>,
    ) {},
    communityActionsFailed(state, action: PayloadAction<any>) {
      state.error = action.payload;
    },
  },
});

export const { actions } = slice;

export const useCommunitySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: communitySaga });
  return { actions: slice.actions };
};
