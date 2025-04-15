import { PayloadAction } from '@reduxjs/toolkit';
import * as genresApis from 'app/apis/genres';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { GetGenresPayload } from './types';

function* getGenres(action: PayloadAction<GetGenresPayload>) {
  try {
    const data = yield call(genresApis.getGenres, action.payload);
    yield put(actions.getGenresSuccess({ genres: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getGenresFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getGenreDetail(action: PayloadAction<GetGenresPayload>) {
  try {
    const data = yield call(genresApis.getGenreDetail, action.payload);
    yield put(actions.getGenreDetailSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getGenreDetailFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* genresSaga() {
  yield takeLatest(actions.getGenresRequest.type, getGenres);
  yield takeLatest(actions.getGenreDetailRequest.type, getGenreDetail);
}
