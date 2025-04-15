import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.globalLoading || initialState;

export const selectGlobalLoading = createSelector(
  [selectSlice],
  state => state,
);

export const getLoadingStatus = createSelector(
  [selectSlice],
  state => state.isShowLoading,
);
