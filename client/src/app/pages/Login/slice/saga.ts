import { PayloadAction } from '@reduxjs/toolkit';
import * as authApis from 'app/apis/auth';
import { ACCESS_TOKEN, IS_REDIRECT_URL, REFRESH_TOKEN } from 'app/constants';
import { IMG_OF_USER } from 'app/constants/enum';
import { setLocalStorage } from 'app/helpers/local-storage';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { toastError } from 'app/helpers/toast';
import axiosService from 'app/services/axios.service';
import { call, put, takeLatest } from 'redux-saga/effects';
import { authActions as actions } from '.';
import { actions as actionsMyProfileBio } from 'app/components/MyProfileBio/slice';
import * as uploadS3Apis from 'app/apis/uploadS3';
import {
  UpdateUserPayload,
  uploadImgUserPayload,
  GoogleAuthenticatePayload,
  LoginPayload,
} from './types';
import { actionsAuth } from 'app/components/MyProfileBio/slice';

function* login(action: PayloadAction<LoginPayload>) {
  try {
    const data = yield call(authApis.login, action.payload);
    yield handleAuthenticateResponse(data);
  } catch (error: any) {
    yield handleError(error);
  }
}

function* authenticateWithGoogle(
  action: PayloadAction<GoogleAuthenticatePayload>,
) {
  try {
    const data = yield call(authApis.authenticateWithGoogle, action.payload);
    yield handleAuthenticateResponse(data);
  } catch (error: any) {
    yield handleError(error);
  }
}

function* authenticateWithDropbox(action: PayloadAction<string>) {
  try {
    const data = yield call(authApis.authenticateWithDropbox, action.payload);
    yield handleAuthenticateResponse(data);
  } catch (error: any) {
    yield handleError(error);
  }
}

function* authenticateWithFacebook(
  action: PayloadAction<GoogleAuthenticatePayload>,
) {
  try {
    const data = yield call(authApis.authenticateWithFacebook, action.payload);
    yield handleAuthenticateResponse(data);
  } catch (error: any) {
    yield handleError(error);
  }
}

function* handleAuthenticateResponse(data: any) {
  if (data) {
    const accessToken = data?.data?.accessToken;
    const refreshToken = data?.data?.refreshToken;

    axiosService.setHeader('Authorization', `Bearer ${accessToken}`);
    setLocalStorage(ACCESS_TOKEN, accessToken);
    setLocalStorage(REFRESH_TOKEN, refreshToken);
    setLocalStorage(IS_REDIRECT_URL, true);
    yield getMe();
    yield put(actions.loginSuccess(data?.data));
    if (data?.data?.isContributor && data?.data?.needToConfirmContributor) {
      window.history.pushState({}, '', '/contributor-onboarding');
    }
  } else {
    yield put(actions.authActionFailed('No data!'));
  }
}

function* getMe() {
  try {
    const data = yield call(authApis.getMe);
    yield put(actions.getMeSuccess(data));
  } catch (error) {
    yield handleError(error);
  }
}

function* updateUser(action: PayloadAction<UpdateUserPayload>) {
  try {
    const data = yield call(authApis.updateUser, action.payload);
    yield put(actions.updateUserSuccess(data));
    yield put(actionsMyProfileBio.updateUserInReducer(data));
  } catch (error: any) {
    yield put(actions.updateUserFailure(getErrorMsgResponse(error)));
    const errMsg = getErrorMsgResponse(error);

    toastError(errMsg);
  }
}

function* handleError(error: any) {
  const errMsg = getErrorMsgResponse(error);
  yield put(actions.authActionFailed(errMsg));
  yield toastError(errMsg);
}
function* uploadImgUser(action: PayloadAction<uploadImgUserPayload>) {
  if (action.payload.typePic === IMG_OF_USER.PROMOSHOT_IMAGE)
    yield put(actions.showPromoLoading());
  const { file, path } = action.payload;
  try {
    if (action.payload.typePic === IMG_OF_USER.AVATAR) {
      yield put(actions.showAvatarLoading());
      const data = yield call(uploadS3Apis.UploadAvatar, {
        file,
        path,
      });

      const dataImg = { ...data, typePic: action.payload.typePic };

      if (dataImg.typePic === IMG_OF_USER.AVATAR) {
        const updateAvatar = {
          avatar: data.data.url,
        };

        yield put(actionsAuth.updateUserInReducer(updateAvatar));
        yield put(actions.uploadImgUserSuccess(dataImg));
      } else {
        yield call(authApis.updateUser, { promoShot: data.data.url });
        yield put(actions.uploadImgUserSuccess(dataImg));
      }
    } else if (action.payload.typePic === IMG_OF_USER.COVER_IMAGE) {
      yield put(actions.showCoverLoading());
      const data = yield call(uploadS3Apis.UploadCover, {
        file,
        path,
      });

      const dataImg = { ...data, typePic: action.payload.typePic };

      if (dataImg.typePic === IMG_OF_USER.COVER_IMAGE) {
        const updateAvatar = {
          cover: data?.data?.url,
        };
        yield put(actionsAuth.updateUserInReducer(updateAvatar));
        yield put(actions.uploadImgUserSuccess(dataImg));
      } else {
        yield put(
          actionsAuth.updateUserInReducer({ promoShot: data?.data?.url }),
        );

        yield put(actions.uploadImgUserSuccess(dataImg));
      }
    }
  } catch (error: any) {
    yield put(actions.uploadImgUserFailure(getErrorMsgResponse(error)));
  } finally {
  }
}

export function* authSaga() {
  yield takeLatest(actions.uploadImgUserRequest.type, uploadImgUser);
  yield takeLatest(actions.updateUserRequest.type, updateUser);
  yield takeLatest(actions.loginRequest.type, login);
  yield takeLatest(actions.getMe.type, getMe);
  yield takeLatest(actions.authenticateWithGoogle.type, authenticateWithGoogle);
  yield takeLatest(
    actions.authenticateWithDropbox.type,
    authenticateWithDropbox,
  );
  yield takeLatest(
    actions.authenticateWithFacebook.type,
    authenticateWithFacebook,
  );
}
