import { PayloadAction } from '@reduxjs/toolkit';
import * as changePassWordApis from 'app/apis/changePass';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { ChangePasswordPayload } from './types';

function* changePassword(action: PayloadAction<ChangePasswordPayload>) {
  try {
    yield call(changePassWordApis.changePassword, action.payload);
    yield put(actions.changePassWordSuccess());
  } catch (error) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.changePassWordFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* changePasswordSaga() {
  yield takeLatest(actions.changePassWordRequest.type, changePassword);
}
