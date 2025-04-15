import { PayloadAction } from '@reduxjs/toolkit';
import * as tagsApis from 'app/apis/tags';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { GetTagsPayload } from './types';

function* getTags(action: PayloadAction<GetTagsPayload>) {
  try {
    const data = yield call(tagsApis.getTags, action.payload);
    yield put(actions.getTagsSuccess({ tags: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTagsFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getTagDetail(action: PayloadAction<GetTagsPayload>) {
  try {
    const data = yield call(tagsApis.getTagDetail, action.payload);
    yield put(actions.getTagDetailSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTagDetailFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* tagsSaga() {
  yield takeLatest(actions.getTagsRequest.type, getTags);
  yield takeLatest(actions.getTagDetailRequest.type, getTagDetail);
}
