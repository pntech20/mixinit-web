import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSliceTag = (state: RootState) => state.tags || initialState;

export const selectSliceTags = createSelector([selectSliceTag], state => state);
export const selectTags = createSelector([selectSliceTag], state => state.tags);
