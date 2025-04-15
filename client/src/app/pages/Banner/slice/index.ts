import { PayloadAction } from '@reduxjs/toolkit';
import { Banner } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { BannerSaga } from './saga';
import { BannerState } from './types';

export const initialState: BannerState = {
  banners: [],
  error: null,
};

const slice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    getBannerRequest(state) {},
    getBannerSuccess(state, action: PayloadAction<Banner[]>) {
      state.banners = action.payload;
    },
    getBannerFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { actions } = slice;

export const useBannerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: BannerSaga });
  return { actions: slice.actions };
};
