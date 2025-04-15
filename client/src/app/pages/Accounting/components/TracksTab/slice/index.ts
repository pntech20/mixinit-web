import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { accountingTrackSaga } from './saga';
import {
  AccountingTrackItem,
  AccountingTrackState,
  GetAccountingTrackPayload,
} from './types';

export const initialState: AccountingTrackState = {
  error: null,
  isLoading: false,
  tracks: [],
};

const slice = createSlice({
  name: 'accountingTrack',
  initialState,
  reducers: {
    accountingTrackRequest(
      state,
      action: PayloadAction<GetAccountingTrackPayload>,
    ) {
      state.error = null;
      state.isLoading = true;
      state.tracks = [];
    },
    accountingTrackSuccess(
      state,
      action: PayloadAction<AccountingTrackItem[]>,
    ) {
      state.isLoading = false;
      state.tracks = action.payload;
    },
    accountingTrackActionFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: accountingTrackActions } = slice;

export const useAccountingTrackSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: accountingTrackSaga });
  return { actions: slice.actions };
};
