import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceSection = (state: RootState) => state.sections || initialState;

export const selectSliceSections = createSelector(
  [selectSliceSection],
  state => state,
);
export const selectSections = createSelector(
  [selectSliceSection],
  state => state.sections,
);
