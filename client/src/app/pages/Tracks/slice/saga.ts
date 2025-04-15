import { PayloadAction } from '@reduxjs/toolkit';
import * as trackApis from 'app/apis/track';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { actionsAuth, authActions } from 'app/pages/Login/slice';
import { actionsWishlists } from 'app/pages/Wishlist/slice';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { actions as actionsInput } from '../../../components/InputSearch/slice/index';
import { actions as actionsTrackDetail } from '../../TracksDetail/slice/index';
import { TrackUpdatePayload, TracksPayload } from './types';
import * as authApis from 'app/apis/auth';

function* getTracks(action: PayloadAction<TracksPayload>) {
  try {
    const data = yield call(trackApis.getTrack, action.payload);

    if (data) {
      yield put(actions.getTracksSuccess(data));
    }
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getTracksFailed(errMsg));
    yield toastError(errMsg);
    yield put(actionsInput.setIsOnchangeInput(false));
  }
}

function* buyTrackBySubscription(action: PayloadAction<any>) {
  try {
    const data = yield call(
      trackApis.buyTrackBySubscriptionApi,
      action.payload,
    );
    yield put(actions.updateTrackBySubscriptionRequest(data));
    // yield put(actions.buyTrackBySubscriptionSuccess(data));
    // yield put(
    //   actionsLabelPurchaseSubscriptions.updateLabelPurchaseSubscriptionsRequest(
    //     data,
    //   ),
    // );
    // yield put(
    //   actionsLabelPurchaseSubscriptions.updateSubscriptionsRequest(data),
    // );
    // yield put(actionsTrackDetail.buyTrackBySubscriptionSuccess(data));
  } catch (error: any) {
    yield put(
      actions.buyTrackBySubscriptionFailure(getErrorMsgResponse(error)),
    );
  }
}

function* updateTrack(action: PayloadAction<TrackUpdatePayload>) {
  try {
    const data = yield call(trackApis.updateTrack, action.payload);
    yield put(actions.updateTrackSuccess(data?.data));
    const dataGetMe = yield call(authApis.getMe);
    yield put(authActions.getMeSuccess(dataGetMe));
  } catch (error: any) {
    yield put(actions.updateTrackFailed(error));
  }
}

function* updateNumberDownloadTrack(action: PayloadAction<any>) {
  try {
    const data = yield call(
      trackApis.updateNumberDownloadTrack,
      action.payload,
    );
    yield put(actions.updateNumberDownloadTrackSuccess(data?.data));
  } catch (error: any) {
    yield put(actions.updateNumberDownloadTrackFailed(error));
  }
}

function* createTrackDraft(action) {
  try {
    const data = yield call(
      trackApis.createTrackDraft,
      action.payload.formData,
    );
    if (data) {
      yield put(actions.createTrackDraftSuccess(data));
    }
  } catch (error) {
    console.log({ error });
  }
}

function* getMyDraftTracks(action) {
  try {
    const data = yield call(trackApis.getMyDraftTracks, action.payload);
    if (data) {
      yield put(actions.getMyDraftTracksSuccess(data));
    }
  } catch (error) {
    console.log({ error });
  }
}

function* deleteDraftTrack(action) {
  try {
    const data = yield call(trackApis.deleteDraftTrack, action.payload);
    if (data) {
      yield put(actions.deleteDraftTracks({ trackIds: [data?.trackId] }));
    }
  } catch (error) {
    console.log({ error });
  }
}

function* deleteTrack(action) {
  try {
    const data = yield call(trackApis.deleteTrack, action.payload);
    yield put(actions.deleteTracksSuccess(data));
    toastSuccess('Delete successfully');
  } catch (error) {
    yield put(actions.deleteTracksFailed(getErrorMsgResponse(error)));
  }
}

function* getTokenMax(action) {
  const data = yield call(trackApis.getMaxMinTokenTrack);
  yield put(actions.getTokenMaxSuccess(data));
}

function* getMyTracksPurchased(payload) {
  try {
    const data = yield call(trackApis.getMyTracksPurchased, payload);
    if (data) {
      yield put(actions.getMyTracksPurchasedSuccess(data));
    }
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actionsInput.setIsOnchangeInput(false));
    yield put(actions.getMyTracksPurchasedFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getMyAllTracksPurchased(payload) {
  try {
    const data = yield call(trackApis.getMyAllTracksPurchased, payload);
    if (data) {
      yield put(actions.getMyAllTracksPurchasedSuccess(data));
    }
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actionsInput.setIsOnchangeInput(false));
    yield put(actions.getMyAllTracksPurchasedFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getMyTracksStarPurchased(payload) {
  try {
    const data = yield call(trackApis.getMyTracksStarPurchased, payload);
    if (data) {
      yield put(actions.getMyTracksStarPurchasedSuccess(data));
    }
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actionsInput.setIsOnchangeInput(false));
    yield put(actions.getMyTracksStarPurchasedFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* getMyTracksSubscriptionPurchased(payload) {
  try {
    const data = yield call(
      trackApis.getMyTracksSubscriptionPurchased,
      payload,
    );
    if (data) {
      yield put(actions.getMyTracksSubscriptionPurchasedSuccess(data));
    }
    yield put(actionsInput.setIsOnchangeInput(false));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actionsInput.setIsOnchangeInput(false));
    yield put(actions.getMyTracksSubscriptionPurchasedFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* buyTrackByStar(action) {
  try {
    const data = yield call(trackApis.buyTrackByStar, action.payload);
    if (data) {
      yield put(actions.buyTrackByStarSuccess(data));
      yield put(
        actionsAuth.updateUserInReducer({
          starsRemaining: data.starsRemaining,
        }),
      );
      yield put(
        actionsTrackDetail.updateStateTrackAndTrackOfReleaseAndTrackOfPlaylist([
          { _id: data._id },
        ]),
      );
      yield put(
        actionsWishlists.updateTrackandReleaseinWishlistsInReducer([
          { _id: data._id },
        ]),
      );
    }
  } catch (error: any) {
    yield put(actions.buyTrackByStarFailed(error));
  }
}

function* updateFavoritedTrack(payload) {
  try {
    yield put(actions.updateFavoritedTrack(payload?.payload));
    yield put(
      actionsTrackDetail.updateFavoriteInTrackDetails(payload?.payload),
    );
    yield call(trackApis.addRemoveFavoriteTrack, payload?.payload?.trackId);
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    console.error(errMsg);
  }
}

export function* TrackSaga() {
  yield takeLatest(actions.getTracksRequest.type, getTracks);
  yield takeLatest(
    actions.buyTrackBySubscriptionRequest.type,
    buyTrackBySubscription,
  );
  // yield takeLatest(actions.buyTrackRequest.type, buyTrack);
  yield takeLatest(actions.updateTrackRequest.type, updateTrack);
  yield takeLatest(actions.deleteTracksRequest.type, deleteTrack);
  yield takeLatest(actions.getTokenMaxRequest.type, getTokenMax);
  yield takeLatest(
    actions.getMyTracksPurchasedRequest.type,
    getMyTracksPurchased,
  );
  yield takeLatest(
    actions.getMyTracksStarPurchasedRequest.type,
    getMyTracksStarPurchased,
  );
  yield takeLatest(actions.buyTrackByStarRequest.type, buyTrackByStar);
  yield takeLatest(actions.createTrackDraftRequest.type, createTrackDraft);
  yield takeLatest(actions.getMyDraftTracksRequest.type, getMyDraftTracks);
  yield takeLatest(actions.deleteDraftTrackRequest.type, deleteDraftTrack);
  yield takeLatest(
    actions.updateNumberDownloadTrackRequest.type,
    updateNumberDownloadTrack,
  );

  yield takeLatest(
    actions.getMyAllTracksPurchasedRequest.type,
    getMyAllTracksPurchased,
  );

  yield takeLatest(
    actions.getMyTracksSubscriptionPurchasedRequest.type,
    getMyTracksSubscriptionPurchased,
  );
  yield takeLatest(
    actions.updateFavoritedTrackRequest.type,
    updateFavoritedTrack,
  );
}
