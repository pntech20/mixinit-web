import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceWishlist = (state: RootState) =>
  state.wishlists || initialState;

export const selectSliceWishlists = createSelector(
  [selectSliceWishlist],
  state => state,
);
