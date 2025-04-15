import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { tagsSaga } from './saga';
import { TagResponse, TagsResponse, TagsState } from './types';

export const initialState: TagsState = {
  error: null,
  tags: [],
  tag: null,
  isLoading: false,
  topTags: {},
};

const slice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    getTagsRequest(state, action: PayloadAction<any>) {
      state.tags = [];
      state.error = null;
      state.isLoading = true;
    },
    getTagsSuccess(state, action: PayloadAction<TagsResponse>) {
      state.tags = action.payload.tags;
      state.isLoading = false;
    },
    getTagsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    // GetTagsPayload wating remove
    getTagDetailRequest(state, action: PayloadAction<string>) {
      state.error = null;
      state.tag = null;
    },
    getTagDetailSuccess(state, action: PayloadAction<TagResponse>) {
      state.tag = action.payload;
    },
    getTagDetailFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    topTags(state, action: PayloadAction<any>) {
      state.topTags[action.payload.cacheKey] = action.payload.data;
    },
  },
});

export const { actions } = slice;

export const useTagsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: tagsSaga });
  return { actions: slice.actions };
};
