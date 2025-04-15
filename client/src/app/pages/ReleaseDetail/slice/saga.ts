import { PayloadAction } from '@reduxjs/toolkit';
import * as releasesApis from 'app/apis/releases';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { ReleaseDetailsPayload } from './types';

function* getReleaseDetail(action: PayloadAction<ReleaseDetailsPayload>) {
  try {
    const data = yield call(releasesApis.getReleaseById, action.payload);
    yield put(actions.getReleaseDetailSuccess(data));
  } catch (error) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getReleaseDetailFailure(errMsg));
    yield toastError(errMsg);
  }
}

function* getTrackByReleaseId(action: PayloadAction<ReleaseDetailsPayload>) {
  try {
    const data = yield call(releasesApis.getTrackByReleaseById, action.payload);
    yield put(actions.getAllTrackByReleaseIdSuccess(data));
  } catch (error) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getAllTrackByReleaseIdFailure(errMsg));
    yield toastError(errMsg);
  } finally {
  }
}

export function* ReleaseDetailSaga() {
  yield takeLatest(actions.getReleaseDetailRequest.type, getReleaseDetail);
  yield takeLatest(
    actions.getAllTrackByReleaseIdRequest.type,
    getTrackByReleaseId,
  );
}
