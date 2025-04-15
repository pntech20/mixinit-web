import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { trackKeysSaga } from './saga';
import { TrackKeysState, TrackKeysResponse } from './types';

export const initialState: TrackKeysState = { trackKeys: [], error: null };

const slice = createSlice({
  name: 'trackKeys',
  initialState,
  reducers: {
    getTrackKeysRequest(state) {
      state.trackKeys = [];
      state.error = null;
    },
    getTrackKeysSuccess(state, action: PayloadAction<TrackKeysResponse>) {
      state.trackKeys = action.payload.trackKeys;
    },
    getTrackKeysFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { actions } = slice;

export const useTrackKeysSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: trackKeysSaga });
  return { actions: slice.actions };
};
