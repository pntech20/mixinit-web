/* eslint-disable @typescript-eslint/no-redeclare */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectSlicePlayer = (state: RootState) => state.player || initialState;

export const selectSliceAudio = createSelector(
  [selectSlicePlayer],
  state => state,
);
