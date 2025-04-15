import { SignupPayload } from 'app/pages/Signup/slice/types';
import { PayloadAction } from '@reduxjs/toolkit';
import * as signupApis from 'app/apis/signup';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

function* signup(action: PayloadAction<SignupPayload>) {
  try {
    const data = yield call(signupApis.signup, action.payload);
    yield put(actions.signupSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.signupFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* signupSaga() {
  yield takeLatest(actions.signupRequest.type, signup);
}
