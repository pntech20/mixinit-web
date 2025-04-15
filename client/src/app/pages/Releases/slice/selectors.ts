import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceRelease = (state: RootState) => state.releases || initialState;

export const selectSliceReleases = createSelector(
  [selectSliceRelease],
  state => state,
);
export const selectReleases = createSelector(
  [selectSliceRelease],
  state => state.releases,
);
