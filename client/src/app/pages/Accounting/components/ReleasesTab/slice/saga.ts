import { PayloadAction } from '@reduxjs/toolkit';
import * as accountingApis from 'app/apis/accountings';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { accountingReleasesActions as actions } from '.';
import { GetAccountingReleasePayload } from './types';

function* getContributorReleaseAccounting(
  action: PayloadAction<GetAccountingReleasePayload>,
) {
  try {
    const data = yield call(
      accountingApis.getReleasesAccounting,
      action.payload,
    );
    yield put(actions.accountingReleaseSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.accountingReleaseActionFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* accountingReleasesSaga() {
  yield takeLatest(
    actions.accountingReleaseRequest.type,
    getContributorReleaseAccounting,
  );
}
