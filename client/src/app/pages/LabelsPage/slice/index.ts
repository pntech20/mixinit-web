import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { labelsSaga } from './saga';
import { LabelsState } from './types';

export const initialState: LabelsState = {};

const slice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions: labelsActions } = slice;

export const useLabelsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: labelsSaga });
  return { actions: slice.actions };
};
