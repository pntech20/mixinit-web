import { PayloadAction } from '@reduxjs/toolkit';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { accountingTrackActions as actions } from '.';
import { GetAccountingTrackPayload } from './types';
import * as accountingApis from 'app/apis/accountings';

function* getContributorTrackAccounting(
  action: PayloadAction<GetAccountingTrackPayload>,
) {
  try {
    const data = yield call(accountingApis.getTracksAccounting, action.payload);
    yield put(actions.accountingTrackSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.accountingTrackActionFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* accountingTrackSaga() {
  yield takeLatest(
    actions.accountingTrackRequest.type,
    getContributorTrackAccounting,
  );
}
