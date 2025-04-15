import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlicesTokenPackage = (state: RootState) =>
  state.services || initialState;

export const selectSlicesTokenPackages = createSelector(
  [selectSlicesTokenPackage],
  state => state,
);
