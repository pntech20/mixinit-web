import { PayloadAction } from '@reduxjs/toolkit';
import * as trackKeysApis from '../../../apis/trackKeys';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';

import { GetTrackKeysPayload } from './types';

function* getTrackKeys(action: PayloadAction<GetTrackKeysPayload>) {
  try {
    const data = yield call(trackKeysApis.getTrackKeys, action.payload);
    yield put(actions.getTrackKeysSuccess({ trackKeys: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTrackKeysFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* trackKeysSaga() {
  yield takeLatest(actions.getTrackKeysRequest.type, getTrackKeys);
}
