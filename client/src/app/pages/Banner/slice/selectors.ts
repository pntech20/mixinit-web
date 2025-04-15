import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceBanner = (state: RootState) => state.banner || initialState;

export const selectSliceBanners = createSelector(
  [selectSliceBanner],
  state => state,
);

export const selectBanners = createSelector(
  [selectSliceBanner],
  state => state.banners,
);
