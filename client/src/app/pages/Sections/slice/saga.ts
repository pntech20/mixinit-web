import { PayloadAction } from '@reduxjs/toolkit';
import * as sectionsApis from 'app/apis/sections';
import { actions as actionsInput } from 'app/components/InputSearch/slice/index';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { GetSectionsPayload } from './types';

function* getSections(action: PayloadAction<GetSectionsPayload>) {
  try {
    const data = yield call(sectionsApis.getSections, action.payload);
    const cacheKey = `${action.payload?.filter?.sort}_${action.payload?.filter?.search}_${action.payload?.filter?.userId}`;
    yield put(
      actions.getSectionsSuccess({
        data: data?.data,
        cacheKey,
        isCacheKey: action.payload.filter?.isCacheKey,
      }),
    );
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actionsInput.setIsOnchangeInput(false));
    yield put(actions.getSectionsFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getAllLabels() {
  try {
    const data = yield call(sectionsApis.getAllLabels);
    yield put(actions.getAllLabelsSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  }
}

function* getMySection() {
  try {
    const data = yield call(sectionsApis.getMySection, null);
    yield put(actions.getMyLabelSuccess({ mySection: data }));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getMyLabelFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getTopLabels(action: PayloadAction<any>) {
  try {
    const data = yield call(sectionsApis.getTopLabels, action.payload);
    yield put(actions.getTopLabelsSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTopLabelsFailed(errMsg));
  }
}

export function* sectionsSaga() {
  yield takeLatest(actions.getSectionsRequest.type, getSections);
  // yield takeLatest(actions.getSectionDetailRequest.type, getSectionDetail);
  yield takeLatest(actions.getMyLabelRequest.type, getMySection);
  yield takeLatest(actions.getTopLabelsRequest.type, getTopLabels);
  yield takeLatest(actions.getAllLabelsRequest.type, getAllLabels);
}
