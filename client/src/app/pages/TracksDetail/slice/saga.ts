import { PayloadAction } from '@reduxjs/toolkit';
import * as authApis from 'app/apis/track';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

function* getTrackDetail(action: PayloadAction<any>) {
  try {
    const data = yield call(authApis.getTrackDetails, action.payload);

    yield put(actions.getTrackDetailSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTrackDetailFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getReleasesTrackDetails(action: PayloadAction<any>) {
  try {
    const data = yield call(authApis.getReleasesTrackDetails, action.payload);

    yield put(actions.getReleasesTrackDetailSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getReleasesTrackDetailFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getRelatedTrackDetails(action: PayloadAction<any>) {
  try {
    const data = yield call(authApis.getRelatedTracksDetails, action.payload);

    yield put(actions.getRelatedTrackDetailSuccess(data));
  } catch (error: any) {
    yield put(actions.getRelatedTrackDetailFailed('Track not found'));
    yield toastError('Track not found');
  }
}

export function* TrackDetailSaga() {
  yield takeLatest(actions.getTrackDetailRequest.type, getTrackDetail);
  yield takeLatest(
    actions.getReleasesTrackDetailRequest.type,
    getReleasesTrackDetails,
  );
  yield takeLatest(
    actions.getRelatedTrackDetailRequest.type,
    getRelatedTrackDetails,
  );
}
