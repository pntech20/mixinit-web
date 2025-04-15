import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceCrate = (state: RootState) => state.crates || initialState;

export const selectSliceCrates = createSelector(
  [selectSliceCrate],
  state => state,
);
export const selectCrates = createSelector(
  [selectSliceCrate],
  state => state.crates,
);
