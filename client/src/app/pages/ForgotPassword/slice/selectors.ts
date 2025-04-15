import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.forgotPassword || initialState;

export const selectForgotPassword = createSelector(
  [selectSlice],
  state => state,
);
