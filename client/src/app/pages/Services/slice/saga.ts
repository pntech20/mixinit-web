import { PayloadAction } from '@reduxjs/toolkit';
import * as servicesApis from 'app/apis/services';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import {
  BuyTokenPackagePayload,
  GetTokenPackagesPayload,
  SubscribeStoragePlayload,
  SubscribeTierPlayload,
  UnSribeSubscriptionPayload,
} from './types';
import { authActions } from '../../Login/slice/index';
import { globalLoadingActions } from 'app/components/Loading/slice';
import { actions as actionsSubscriptions } from '../../Subscriptions/slice/index';

function* getTokenPackages(action: PayloadAction<GetTokenPackagesPayload>) {
  try {
    const response = yield call(servicesApis.getTokenPackages, action.payload);
    yield put(actions.getTokenPackagesSuccess(response));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTokenPackagesFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getStoragePlans(action: PayloadAction<null>) {
  try {
    const response = yield call(servicesApis.getStoragePlans, action.payload);
    yield put(actions.getStoragePlansSuccess(response));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getStoragePlansFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getSubcriptionTiers(action: PayloadAction<null>) {
  try {
    const response = yield call(
      servicesApis.getSubscriptionTiers,
      action.payload,
    );
    yield put(actions.getSubcriptionTiersSuccess(response));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getSubcriptionTiersFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* buyTokenPackage(action: PayloadAction<BuyTokenPackagePayload>) {
  yield put(globalLoadingActions.showLoading());
  try {
    const data = yield call(servicesApis.buyTokenPackage, action.payload);

    yield put(actions.buyTokenPackageSuccess(data));
    // yield put(
    //   actionsLabelPurchaseSubscriptions.updateLabelPurchaseSubscriptionsAfterSubscribe(
    //     data,
    //   ),
    // );
    yield put(actionsSubscriptions.updateSubscriptionsAfterSubscribe(data));
    toastSuccess('Success');
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  } finally {
    yield put(globalLoadingActions.hideLoading());
  }
}

function* subscribeSubscriptionTier(
  action: PayloadAction<SubscribeTierPlayload>,
) {
  try {
    const data = yield call(servicesApis.subscribeTier, action.payload);
    yield put(actions.subscribeTierSuccess(data));
    yield put(authActions.updateUserInReducer(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.subscribeTierFailure(errMsg));
    yield toastError(errMsg);
  }
}

function* unsubscribeSubscriptionTier() {
  try {
    const data = yield call(servicesApis.unsubscribeTier);
    yield put(actions.unsubscribeTierSuccess(data));
    yield put(authActions.updateUserInReducer(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.unsubscribeTierFailure(errMsg));
    yield toastError(errMsg);
  }
}

function* unsubscribeSubscription(
  action: PayloadAction<UnSribeSubscriptionPayload>,
) {
  try {
    const data = yield call(
      servicesApis.unsubscribeSubscription,
      action.payload,
    );
    toastSuccess('Success');
    yield put(actions.unsubscribeSubscriptionSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield toastError(errMsg);
  }
}

function* subscribeSubscriptionStorage(
  action: PayloadAction<SubscribeStoragePlayload>,
) {
  try {
    const data = yield call(servicesApis.subscribeStorage, action.payload);
    toastSuccess('Success');
    yield put(actions.subscribeStorageSuccess(data));
    yield put(authActions.updateUserInReducer(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.subscribeStorageFailure(errMsg));
    yield toastError(errMsg);
  }
}

function* unSubscribeSubscriptionStorage() {
  try {
    const data = yield call(servicesApis.unsubscribeStorage);
    yield put(actions.unsubscribeStorageSuccess(data));
    yield put(authActions.updateUserInReducer(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.unsubscribeStorageFailure(errMsg));
  }
}

export function* servicesSaga() {
  yield takeLatest(actions.getTokenPackagesRequest.type, getTokenPackages);
  yield takeLatest(actions.getStoragePlansRequest.type, getStoragePlans);
  yield takeLatest(
    actions.getSubcriptionTiersRequest.type,
    getSubcriptionTiers,
  );
  yield takeLatest(actions.buyTokenPackageRequest.type, buyTokenPackage);
  yield takeLatest(
    actions.subscribeTierRequest.type,
    subscribeSubscriptionTier,
  );
  yield takeLatest(
    actions.unsubscribeTierRequest.type,
    unsubscribeSubscriptionTier,
  );
  yield takeLatest(
    actions.subscribeStorageRequest.type,
    subscribeSubscriptionStorage,
  );
  yield takeLatest(
    actions.unsubscribeStorageRequest.type,
    unSubscribeSubscriptionStorage,
  );
  yield takeLatest(
    actions.unsubscribeSubscriptionRequest.type,
    unsubscribeSubscription,
  );
}
