import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceReleaseDetail = (state: RootState) =>
  state.releaseDetail || initialState;

export const selectReleaseDetail = createSelector(
  [selectSliceReleaseDetail],
  state => state,
);
