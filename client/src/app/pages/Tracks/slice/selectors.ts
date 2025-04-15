/* eslint-disable @typescript-eslint/no-redeclare */
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceTrack = (state: RootState) => state.track || initialState;

export const selectSliceTracks = createSelector(
  [selectSliceTrack],
  state => state,
);
export const selectTracks = createSelector(
  [selectSliceTrack],
  state => state.tracks,
);
