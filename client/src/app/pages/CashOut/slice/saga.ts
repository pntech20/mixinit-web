import * as cashoutsApis from 'app/apis/cashOut';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { RequestCashOutPayload, ProceedCashOutPayload } from './types';
import { PayloadAction } from '@reduxjs/toolkit';
import { actionsAuth } from '../../Login/slice/index';

function* requestCashout(action: PayloadAction<RequestCashOutPayload>) {
  try {
    const data = yield call(cashoutsApis.requestCashOut, action.payload);
    toastSuccess(data?.data);
    yield put(actions.getCashoutsSuccess(data));
  } catch (error) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getCashoutsFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* proceedCashOut(action: PayloadAction<ProceedCashOutPayload>) {
  try {
    const data = yield call(cashoutsApis.proceedCashOut, action.payload);
    yield put(actions.getProceedCashOutSuccess(data));
    yield put(actionsAuth.updateUserInReducer(data.data));
  } catch (error) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getProceedCashOutFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* cashoutsSaga() {
  yield takeLatest(actions.getCashoutsRequest.type, requestCashout);
  yield takeLatest(actions.getProceedCashOutRequest.type, proceedCashOut);
}
