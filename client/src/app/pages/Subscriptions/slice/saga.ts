import { PayloadAction } from '@reduxjs/toolkit';
import * as subscriptionApis from 'app/apis/subscription ';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

export function* subscriptionsSaga() {
  function* getMySubscriptions(action: PayloadAction<any>) {
    try {
      const data = yield call(subscriptionApis.getMySubscriptionTransaction);
      yield put(actions.getMySubscriptionsSuccess(data));
    } catch (error: any) {
      const errMsg = getErrorMsgResponse(error);
      yield toastError(errMsg);
    }
  }

  yield takeLatest(actions.getMySubscriptionsRequest.type, getMySubscriptions);
}
