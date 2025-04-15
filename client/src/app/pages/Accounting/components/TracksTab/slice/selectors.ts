import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.accountingTrack || initialState;

export const selectAccountingTrack = createSelector(
  [selectSlice],
  state => state,
);
