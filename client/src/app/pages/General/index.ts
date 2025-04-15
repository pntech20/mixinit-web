import { PayloadAction } from '@reduxjs/toolkit';
import { General } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { GeneralSaga } from './saga';
import { GeneralState } from './types';

export const initialState: GeneralState = {
  generals: [],
  isScrollPassFilter: false,
  scrollValue: 0,
  error: null,
};

const slice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    getGeneralRequest(state) {},
    getGeneralrSuccess(state, action: PayloadAction<General[]>) {
      state.generals = action.payload;
    },
    getGeneralFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    setIsScrollPastFilter(state) {
      state.isScrollPassFilter = true;
    },
    setScrollValue(state, action: PayloadAction<any>) {
      state.scrollValue = action.payload;
    },
    setIsNotScrollPastFilter(state) {
      state.isScrollPassFilter = false;
    },
  },
});

export const { actions } = slice;

export const useGeneralSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: GeneralSaga });
  return { actions: slice.actions };
};
