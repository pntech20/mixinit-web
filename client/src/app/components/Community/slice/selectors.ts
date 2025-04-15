import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceComunity = (state: RootState) =>
  state.community || initialState;

export const selectSliceCommunity = createSelector(
  [selectSliceComunity],
  state => state,
);

export const selectCommunity = createSelector(
  [selectSliceComunity],
  state => state.users,
);
