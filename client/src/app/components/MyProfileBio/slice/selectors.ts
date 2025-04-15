import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceUserByUsername = (state: RootState) =>
  state.userDetails || initialState;

export const selectSliceUserInfo = createSelector(
  [selectSliceUserByUsername],
  state => state,
);

export const selectUserInfo = createSelector(
  [selectSliceUserByUsername],
  state => state.userDetails,
);
