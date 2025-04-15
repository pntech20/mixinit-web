import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.accountingReleases || initialState;

export const selectAccountingReleases = createSelector(
  [selectSlice],
  state => state,
);
