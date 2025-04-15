import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.input || initialState;

export const selectSliceInput = createSelector([selectSlice], state => state);
