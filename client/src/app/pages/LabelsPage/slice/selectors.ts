import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.labels || initialState;

export const selectLabels = createSelector([selectSlice], state => state);
