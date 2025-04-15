import { PayloadAction } from '@reduxjs/toolkit';
import { ForgotPasswordPayload, ResetPasswordPayload } from './types';
import { actions } from '.';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as forgotPasswordApis from 'app/apis/forgotPassword';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';

function* forgotPassword(action: PayloadAction<ForgotPasswordPayload>) {
  try {
    const data = yield call(forgotPasswordApis.forgotPassword, action.payload);
    yield put(actions.forgotPasswordSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.forgotPasswordFailure(errMsg));
    yield toastError(errMsg);
  }
}

function* resetPassword(action: PayloadAction<ResetPasswordPayload>) {
  try {
    const data = yield call(forgotPasswordApis.resetPassword, action.payload);
    yield put(actions.resetPasswordSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.resetPasswordFailure(errMsg));
    yield toastError(errMsg);
  }
}

export function* forgotPasswordSaga() {
  yield takeLatest(actions.forgotPasswordRequest.type, forgotPassword);
  yield takeLatest(actions.resetPasswordRequest.type, resetPassword);
}
