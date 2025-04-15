import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { cashoutsSaga } from './saga';
import {
  RequestCashOutResponse,
  CashOutsState,
  RequestCashOutPayload,
  ProceedCashOutPayload,
  ProceedCashOutResponse,
} from './types';

export const initialState: CashOutsState = {
  error: null,
  isLoading: false,
  requestedCashoutSuccess: false,
  proceedCashoutSuccess: false,
  isLoadingProceed: false,
};

const slice = createSlice({
  name: 'cashout',
  initialState,
  reducers: {
    getCashoutsRequest(state, action: PayloadAction<RequestCashOutPayload>) {
      state.requestedCashoutSuccess = false;
      state.isLoading = true;
      state.error = null;
    },
    getCashoutsSuccess(state, action: PayloadAction<RequestCashOutResponse>) {
      state.requestedCashoutSuccess = true;
      state.isLoading = false;
    },
    getCashoutsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.requestedCashoutSuccess = false;
      state.isLoading = false;
    },

    getProceedCashOutRequest(
      state,
      action: PayloadAction<ProceedCashOutPayload>,
    ) {
      state.proceedCashoutSuccess = false;
      state.isLoadingProceed = true;
      state.error = null;
    },
    getProceedCashOutSuccess(
      state,
      action: PayloadAction<ProceedCashOutResponse>,
    ) {
      state.proceedCashoutSuccess = true;
      state.isLoadingProceed = false;
    },
    getProceedCashOutFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.proceedCashoutSuccess = false;
      state.isLoadingProceed = false;
    },
  },
});

export const { actions } = slice;

export const useCashoutsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: cashoutsSaga });
  return { actions: slice.actions };
};
