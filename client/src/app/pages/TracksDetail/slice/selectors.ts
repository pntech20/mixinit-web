import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceTrackDetail = (state: RootState) =>
  state.trackDetail || initialState;

export const selectTrackDetail = createSelector(
  [selectSliceTrackDetail],
  state => state,
);
