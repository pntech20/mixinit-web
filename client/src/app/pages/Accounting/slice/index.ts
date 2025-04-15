import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { accountingSaga } from './saga';
import { AccountingLabelItem, AccountingState } from './types';

export const initialState: AccountingState = {
  error: null,
  isLoading: false,
  labels: [],
};

const slice = createSlice({
  name: 'accounting',
  initialState,
  reducers: {
    accountingLabelRequest(state, action: PayloadAction<any>) {
      state.error = null;
      state.isLoading = true;
      state.labels = [];
    },
    accountingLabelSuccess(
      state,
      action: PayloadAction<AccountingLabelItem[]>,
    ) {
      state.isLoading = false;
      state.labels = action.payload;
    },
    accountingActionFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: accountingActions } = slice;

export const useAccountingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: accountingSaga });
  return { actions: slice.actions };
};
