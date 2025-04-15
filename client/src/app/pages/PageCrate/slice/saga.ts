import { PayloadAction } from '@reduxjs/toolkit';
import * as crateApis from 'app/apis/crates';
import { globalLoadingActions } from 'app/components/Loading/slice';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import * as crateTypes from './types';
import { CreateCratePayload } from './types';

function* createCrateSaga({ payload }: PayloadAction<CreateCratePayload>) {
  try {
    yield put(globalLoadingActions.showLoading());
    const data = yield call(crateApis.createCrate, payload);
    yield put(actions.createsCratesSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  } finally {
    yield put(globalLoadingActions.hideLoading());
  }
}
function* getCrates({
  payload,
}: PayloadAction<crateTypes.GetListCratesPayload>) {
  try {
    // const data = yield call(crateApis.getMyCrates, payload);
    // yield put(actions.getCratesSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  }
}

function* getMyCrates({
  payload,
}: PayloadAction<crateTypes.GetListCratesPayload>) {
  try {
    const data = yield call(crateApis.getMyCrates, payload);
    yield put(actions.getMyCratesSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  }
}

function* updateCrates({ payload }: PayloadAction<any>) {
  try {
    yield put(globalLoadingActions.showLoading());
    const data = yield call(crateApis.updateCrate, payload);
    yield put(actions.updateCrateSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  } finally {
    yield put(globalLoadingActions.hideLoading());
  }
}

function* deleteMyCrates({ payload }: PayloadAction<any>) {
  try {
    const data = yield call(crateApis.deleteCrate, payload);
    yield put(actions.deleteMyCrateSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  }
}

export function* CratesSaga() {
  yield all([
    yield takeLatest(actions.createsCratesRequest, createCrateSaga),
    yield takeLatest(actions.getCratesRequest, getCrates),
    yield takeLatest(actions.updateCrateRequest, updateCrates),
    yield takeLatest(actions.getMyCratesRequest, getMyCrates),
    yield takeLatest(actions.deleteMyCrateRequest, deleteMyCrates),
  ]);
}
