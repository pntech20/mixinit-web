import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// const selectSlice = (state: RootState) => state.genres || initialState;

// export const selectGenres = createSelector([selectSlice], state => state);

const selectSliceGenre = (state: RootState) => state.genres || initialState;

export const selectSliceGenres = createSelector(
  [selectSliceGenre],
  state => state,
);
export const selectGenres = createSelector(
  [selectSliceGenre],
  state => state.genres,
);
