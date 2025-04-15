import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceCashOut = (state: RootState) => state.cashout || initialState;

export const selectSliceCashOuts = createSelector(
  [selectSliceCashOut],
  state => state,
);
