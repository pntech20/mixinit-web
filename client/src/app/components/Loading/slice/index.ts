import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { GlobalLoadingState } from './types';

export const initialState: GlobalLoadingState = {
  isShowLoading: false,
};

const slice = createSlice({
  name: 'globalLoading',
  initialState,
  reducers: {
    showLoading(state) {
      state.isShowLoading = true;
    },
    hideLoading(state) {
      state.isShowLoading = false;
    },
  },
});

export const { actions: globalLoadingActions } = slice;

export const useGlobalLoadingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
