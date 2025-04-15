import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { accountingReleasesSaga } from './saga';
import {
  AccountingReleaseItem,
  AccountingReleasesState,
  GetAccountingReleasePayload,
} from './types';

export const initialState: AccountingReleasesState = {
  error: null,
  isLoading: false,
  releases: [],
};

const slice = createSlice({
  name: 'accountingReleases',
  initialState,
  reducers: {
    accountingReleaseRequest(
      state,
      action: PayloadAction<GetAccountingReleasePayload>,
    ) {
      state.error = null;
      state.isLoading = true;
      state.releases = [];
    },
    accountingReleaseSuccess(
      state,
      action: PayloadAction<AccountingReleaseItem[]>,
    ) {
      state.isLoading = false;
      state.releases = action.payload;
    },
    accountingReleaseActionFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions: accountingReleasesActions } = slice;

export const useAccountingReleasesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: accountingReleasesSaga });
  return { actions: slice.actions };
};
