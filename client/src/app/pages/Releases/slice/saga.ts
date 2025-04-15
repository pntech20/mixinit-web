import { PayloadAction } from '@reduxjs/toolkit';
import * as releaseApis from 'app/apis/releases';
import { actions as actionsInput } from 'app/components/InputSearch/slice/index';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import {
  CreateReleasePayload,
  EditReleasePayload,
  GetReleasesPayload,
} from './types';

function* getReleases(action: PayloadAction<GetReleasesPayload>) {
  try {
    const data = yield call(releaseApis.getReleases, action.payload);
    yield put(actions.getReleasesSuccess(data));
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getReleasesFailed(errMsg));
    yield toastError(errMsg);
    yield put(actionsInput.setIsOnchangeInput(false));
  }
}

function* topReleases(action: PayloadAction<{ selectedTime: number }>) {
  try {
    const data = yield call(releaseApis.getTopReleases, action.payload);
    yield put(actions.getTopReleasesSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTopReleasesFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* createRelease(action: PayloadAction<CreateReleasePayload>) {
  try {
    const data = yield call(releaseApis.createRelease, action.payload);
    yield put(actions.createReleaseSuccess({ release: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.createReleaseFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* updateRelease(action: PayloadAction<EditReleasePayload>) {
  try {
    const data = yield call(releaseApis.updateRelease, action.payload);
    yield put(actions.updateReleaseSuccess({ release: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.updateReleaseFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getFeaturesReleases(action: PayloadAction<GetReleasesPayload>) {
  try {
    const data = yield call(releaseApis.getReleases, action.payload);

    yield put(actions.getFeaturesReleasesSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getFeaturesReleasesFailed(errMsg));
    yield toastError(errMsg);
  }
}
function* getReleaseBy7Days(action: PayloadAction<GetReleasesPayload>) {
  try {
    const data = yield call(releaseApis.getReleases, action.payload);

    yield put(actions.getReleaseBy7DaysSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getReleaseBy7DaysFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getByCreateReleases(action: PayloadAction<GetReleasesPayload>) {
  try {
    const data = yield call(releaseApis.getReleases, action.payload);
    yield put(actions.getByCreateReleasesSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getByCreateReleasesFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* deleteRelease(action) {
  try {
    const data = yield call(releaseApis.deleteRelease, action.payload);
    yield put(actions.deleteReleaseSuccess(data));
    toastSuccess('Delete successfully');
  } catch (error) {
    yield put(actions.deleteReleaseFailed(getErrorMsgResponse(error)));
  }
}

export function* ReleasesSaga() {
  yield takeLatest(actions.getReleasesRequest.type, getReleases);
  yield takeLatest(actions.createReleaseRequest.type, createRelease);

  yield takeLatest(
    actions.getFeaturesReleasesRequest.type,
    getFeaturesReleases,
  );
  yield takeLatest(
    actions.getByCreateReleasesRequest.type,
    getByCreateReleases,
  );
  yield takeLatest(actions.getReleaseBy7DaysRequest.type, getReleaseBy7Days);
  yield takeLatest(actions.updateReleaseRequest.type, updateRelease);
  yield takeLatest(actions.getTopReleasesRequest.type, topReleases);
  yield takeLatest(actions.deleteReleaseRequest.type, deleteRelease);
}
