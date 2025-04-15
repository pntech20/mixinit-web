import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.accounting || initialState;

export const selectAccounting = createSelector([selectSlice], state => state);
