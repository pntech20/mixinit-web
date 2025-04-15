import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceGeneral = (state: RootState) => state.general || initialState;

export const selectSliceGenerals = createSelector(
  [selectSliceGeneral],
  state => state,
);

export const selectGeneral = createSelector(
  [selectSliceGeneral],
  state => state.generals,
);
