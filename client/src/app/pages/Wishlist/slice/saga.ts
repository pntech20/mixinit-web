import { PayloadAction } from '@reduxjs/toolkit';
import * as wishlistsApis from 'app/apis/wishlist';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { actionsReleases } from 'app/pages/ReleaseDetail/slice';
import { actionReleases } from 'app/pages/Releases/slice';
import { actionsTracks } from 'app/pages/Tracks/slice';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions } from '.';
import { AddTrackToMyWishlistPayload } from './types';
import { actions as actionsTrackDetail } from '../../TracksDetail/slice/index';

function* getMyWishlist() {
  try {
    const data = yield call(wishlistsApis.getMyWishlist);
    yield put(actions.getWishlistSuccess(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.getWishlistFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* addReleaseToMyWishlist(
  action: PayloadAction<AddTrackToMyWishlistPayload>,
) {
  try {
    const data = yield call(
      wishlistsApis.addReleaseToMyWishlist,
      action.payload,
    );
    yield put(actions.addReleaseToMyWishlistSuccess(data));
    const getItems = state => state.wishlists;
    const items = yield select(getItems);

    const releasesCart = (items?.myWishlists || []).filter(
      i => i?.type === 'release',
    );

    const tracksCart = (items?.myWishlists || [])
      .filter(i => i?.type === 'track')
      .map(i => i?.track?._id);

    const trackBelongRelease = releasesCart
      .map((c: any) => c?.release.tracks.map(tr => tr._id))
      .flat();

    const listtrack = tracksCart.filter(tr => trackBelongRelease.includes(tr));

    if (listtrack.length > 0) {
      const data = yield call(wishlistsApis.removeTrackToMyWishlist, listtrack);
      yield put(actions.removeTrackToMyWishlistSuccess(data));
    }

    if (data) {
      toastSuccess('Add successfully');
    }
    yield put(
      actionReleases.updateBelongMyWishlistRelease({
        releaseId: data?.release?._id,
        isBelongMyWishlist: true,
      }),
    );
    yield put(actionsReleases.addReleaseByIdInReducer(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.addReleaseToMyWishlistFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* addTrackToMyWishlist(
  action: PayloadAction<AddTrackToMyWishlistPayload>,
) {
  try {
    const data = yield call(wishlistsApis.addTrackToMyWishlist, action.payload);
    if (data) {
      toastSuccess('Add successfully');
    }
    yield put(actions.addTrackToMyWishlistSuccess(data));
    const dataTrack = {
      isBelongMyWishlist: true,
      data: [data],
    };
    yield put(actionsTracks.updateTracksInReducer(dataTrack));
    yield put(actionsReleases.updateTrackByPlaylistIdInReducer(dataTrack));
    yield put(
      actionsTrackDetail.updateStateRelatedTrackDetail({
        _id: action.payload,
        isBelongMyWishlist: true,
      }),
    );
    yield put(
      actionsTrackDetail.updateStateTrackDetail({
        isBelongMyWishlist: true,
      }),
    );
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.addTrackToMyWishlistFailed(errMsg));
    yield toastError(errMsg);
  }
}

function* removeTrackToMyWishlist(action) {
  try {
    const data = yield call(
      wishlistsApis.removeTrackToMyWishlist,
      action.payload,
    );
    if (data) {
      toastSuccess('Remove successfully');
    }
    yield put(actions.removeTrackToMyWishlistSuccess(data));
    const dataTrack = {
      isBelongMyWishlist: false,
      data,
    };
    yield put(actionsTracks.updateTracksInReducer(dataTrack));
    yield put(actionsReleases.updateTrackByPlaylistIdInReducer(dataTrack));
    yield put(
      actionsTrackDetail.updateStateRelatedTrackDetail({
        _id: action.payload[0],
        isBelongMyWishlist: false,
      }),
    );
    yield put(
      actionsTrackDetail.updateStateTrackDetail({
        isBelongMyWishlist: false,
      }),
    );
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.removeTrackToMyWishlistFailed(errMsg));
    yield toastError(errMsg);
  }
}
function* removeReleaseToMyWishlist(action) {
  try {
    const data = yield call(
      wishlistsApis.removeReleaseToMyWishlist,
      action.payload,
    );

    if (data) {
      toastSuccess('Remove successfully');
    }
    yield put(actions.removeReleaseToMyWishlistSuccess(data));
    yield put(
      actionReleases.updateBelongMyWishlistRelease({
        releaseId: data[0]?.release?._id,
        isBelongMyWishlist: false,
      }),
    );
    yield put(actionsReleases.updateReleaseByIdInReducer(data));
  } catch (error: any) {
    const errMsg = getErrorMsgResponse(error);
    yield put(actions.removeReleaseToMyWishlistFailed(errMsg));
    yield toastError(errMsg);
  }
}

export function* wishlistsSaga() {
  yield takeLatest(actions.getWishlistRequest.type, getMyWishlist);
  yield takeLatest(
    actions.addTrackToMyWishlistRequest.type,
    addTrackToMyWishlist,
  );
  yield takeLatest(
    actions.addReleaseToMyWishlistRequest.type,
    addReleaseToMyWishlist,
  );
  yield takeLatest(
    actions.removeTrackToMyWishlistRequest.type,
    removeTrackToMyWishlist,
  );
  yield takeLatest(
    actions.removeReleaseToMyWishlistRequest.type,
    removeReleaseToMyWishlist,
  );
}
