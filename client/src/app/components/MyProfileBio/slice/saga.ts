import { PayloadAction } from '@reduxjs/toolkit';
import * as userInfoApis from 'app/apis/userInfo';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { GetUserByUsernamePayload } from './types';

function* getUserBySlug(action: PayloadAction<GetUserByUsernamePayload>) {
  try {
    const data = yield call(userInfoApis.getUserBySlug, action.payload);
    yield put(actions.getUserByUsernameSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getUserByUsernameFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* UserInfoSaga() {
  yield takeLatest(actions.getUserByUserIdRequest.type, getUserBySlug);
}
