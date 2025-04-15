import { PayloadAction } from '@reduxjs/toolkit';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

function* getBanner(action: PayloadAction<null>) {
  try {
    // const data = yield call(bannerApis.getBanners, action.payload);
    // yield put(actions.getBannerSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getBannerFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* BannerSaga() {
  yield takeLatest(actions.getBannerRequest.type, getBanner);
}
