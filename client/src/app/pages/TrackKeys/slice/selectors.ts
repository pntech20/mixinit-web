import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceTrackKey = (state: RootState) =>
  state.trackKeys || initialState;

export const selectSliceTrackKeys = createSelector(
  [selectSliceTrackKey],
  state => state,
);
export const selectTrackKeys = createSelector(
  [selectSliceTrackKey],
  state => state.trackKeys,
);
