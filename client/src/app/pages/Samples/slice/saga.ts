import { PayloadAction } from '@reduxjs/toolkit';
import * as sampleApis from 'app/apis/samples';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

import { GetSamplesPayload, CreateSamplePayload } from './types';

function* getSamples(action: PayloadAction<GetSamplesPayload>) {
  try {
    const data = yield call(sampleApis.getSamples, action.payload);
    yield put(actions.getSamplesSuccess({ samples: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getSamplesFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* createSample(action: PayloadAction<CreateSamplePayload>) {
  try {
    const data = yield call(sampleApis.createSample, action.payload);
    yield put(actions.createSampleSuccess({ sample: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getSamplesFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* samplesSaga() {
  yield takeLatest(actions.getSamplesRequest.type, getSamples);
  yield takeLatest(actions.createSampleRequest.type, createSample);
}
