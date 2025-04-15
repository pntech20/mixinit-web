import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceSubscription = (state: RootState) =>
  state.subscription || initialState;

export const selectSubscriptionSlice = createSelector(
  [selectSliceSubscription],
  state => state,
);
export const selectLabelSubscriptions = createSelector(
  [selectSliceSubscription],
  state => state.subscriptions,
);
