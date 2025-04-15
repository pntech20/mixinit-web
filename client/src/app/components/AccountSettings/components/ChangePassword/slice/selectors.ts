import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.changepassword || initialState;

export const selectChangePassword = createSelector(
  [selectSlice],
  state => state,
);
