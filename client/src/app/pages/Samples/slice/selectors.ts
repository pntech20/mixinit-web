import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceSample = (state: RootState) => state.samples || initialState;

export const selectSliceSamples = createSelector(
  [selectSliceSample],
  state => state,
);
export const selectSamples = createSelector(
  [selectSliceSample],
  state => state.samples,
);
