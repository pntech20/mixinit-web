import { call, put, takeLatest } from 'redux-saga/effects';
import { accountingActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import * as accountingApis from 'app/apis/accountings';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { GetAccountingPayload } from './types';

function* getContributorLabelAccounting(
  action: PayloadAction<GetAccountingPayload>,
) {
  try {
    const data = yield call(accountingApis.getLabelAccounting, action.payload);
    yield put(actions.accountingLabelSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.accountingActionFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* accountingSaga() {
  yield takeLatest(
    actions.accountingLabelRequest.type,
    getContributorLabelAccounting,
  );
}
