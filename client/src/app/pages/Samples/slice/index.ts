import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { samplesSaga } from './saga';
import {
  CreateSamplePayload,
  SampleResponse,
  SamplesResponse,
  SamplesState,
} from './types';

export const initialState: SamplesState = {
  error: null,
  samples: [],
  sample: null,
};

const slice = createSlice({
  name: 'samples',
  initialState,
  reducers: {
    getSamplesRequest(state) {
      state.samples = [];
      state.error = null;
    },
    getSamplesSuccess(state, action: PayloadAction<SamplesResponse>) {
      state.samples = action.payload.samples;
    },
    getSamplesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    //create sample
    createSampleRequest(state, action: PayloadAction<CreateSamplePayload>) {
      state.sample = null;
      state.error = null;
    },
    createSampleSuccess(state, action: PayloadAction<SampleResponse>) {
      state.sample = action.payload.sample;
    },
    createSampleFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { actions } = slice;

export const useSamplesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: samplesSaga });
  return { actions: slice.actions };
};
