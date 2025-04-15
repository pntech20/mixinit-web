import { PayloadAction } from '@reduxjs/toolkit';
import * as authApis from 'app/apis/auth';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { CommunityPayload } from './types';
import { actions as actionsInput } from 'app/components/InputSearch/slice/index';

function* getCommunity(action: PayloadAction<CommunityPayload>) {
  try {
    const data = yield call(authApis.getContributors, action.payload);
    yield put(actions.getCommunitySuccess(data.data));
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getCommunityFailed(errMsg));
    yield toastError(errMsg);
    yield put(actionsInput.setIsOnchangeInput(false));
  }
}

function* getTopCommunity(action: PayloadAction<CommunityPayload>) {
  try {
    const data = yield call(authApis.getContributors, action.payload);
    yield put(
      actions.getTopCommunitySuccess({
        ...data.data,
        filter: action.payload.filter,
      }),
    );
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTopCommunityFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getContributors(action: PayloadAction<CommunityPayload>) {
  try {
    const data = yield call(authApis.getListUsersIsContributor);
    yield put(actions.getContributorsSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  }
}

export function* communitySaga() {
  yield takeLatest(actions.getCommunityRequest.type, getCommunity);
  yield takeLatest(actions.getContributorsRequest.type, getContributors);
  yield takeLatest(actions.getTopCommunityRequest.type, getTopCommunity);
}
