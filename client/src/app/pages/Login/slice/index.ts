import { PayloadAction, current } from '@reduxjs/toolkit';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  REDIRECT_URL,
  REFRESH_TOKEN,
} from 'app/constants';
import { IMG_OF_USER } from 'app/constants/enum';
import { getLocalStorage, removeLocalStorage } from 'app/helpers/local-storage';
import { toastError, toastSuccess } from 'app/helpers/toast';
import axiosService from 'app/services/axios.service';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import {
  AuthState,
  GetMeResponse,
  GoogleAuthenticatePayload,
  LoginPayload,
  LoginResponse,
  UpdateUserPayload,
  uploadImgUserPayload,
  uploadImgUserResponse,
} from './types';
import { isEmpty } from 'ramda';

export const initialState: AuthState = {
  isAuthenticated: false,
  isSessionFetched: false,
  accessToken: null,
  refreshToken: '',
  isLoading: false,
  userDetail: null,
  error: null,
  isShowAvatarLoading: false,
  isShowCoverLoading: false,
  isShowPromoLoading: false,
  isUpdateUserSuccess: false,
  isConfirmContributor: false,
  isDisputing: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state, action: PayloadAction<LoginPayload>) {
      state.accessToken = '';
      state.refreshToken = '';
      state.userDetail = null;
      state.isLoading = true;
      state.isAuthenticated = false;
      state.isSessionFetched = false;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      const redirectUrl = getLocalStorage(REDIRECT_URL);
      if (
        action.payload?.isContributor &&
        action.payload?.needToConfirmContributor
      ) {
        window.history.pushState({}, '', '/contributor-onboarding');
      } else {
        if (!isEmpty(redirectUrl)) {
          window.history.pushState({}, '', redirectUrl);
        } else window.history.pushState({}, '', '/home');
      }
      window.location.reload();
    },
    getMe(state) {},
    getMeSuccess(state, action: PayloadAction<GetMeResponse>) {
      state.userDetail = action.payload;
      state.isSessionFetched = true;
      state.isAuthenticated = true;
    },
    authenticateWithGoogle(
      state,
      action: PayloadAction<GoogleAuthenticatePayload>,
    ) {
      state.accessToken = '';
      state.refreshToken = '';
      state.userDetail = null;
      state.isLoading = true;
      state.isAuthenticated = false;
      state.isSessionFetched = false;
      state.error = null;
    },
    authenticateWithFacebook(
      state,
      action: PayloadAction<GoogleAuthenticatePayload>,
    ) {
      state.accessToken = '';
      state.refreshToken = '';
      state.userDetail = null;
      state.isLoading = true;
      state.isAuthenticated = false;
      state.isSessionFetched = false;
      state.error = null;
    },
    authenticateWithDropbox(
      state,
      action: PayloadAction<GoogleAuthenticatePayload>,
    ) {
      state.accessToken = '';
      state.refreshToken = '';
      state.userDetail = null;
      state.isLoading = true;
      state.isAuthenticated = false;
      state.isSessionFetched = false;
      state.error = null;
    },
    authActionFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout(state) {
      removeLocalStorage(ACCESS_TOKEN);
      removeLocalStorage(REFRESH_TOKEN);
      removeLocalStorage(REDIRECT_URL);
      axiosService.removeHeader(AUTHORIZATION);
      state.isAuthenticated = false;
      state.accessToken = null;
      // state.isSessionFetched = false;
      window.location.reload();
    },
    updateUserInReducer(state, action: PayloadAction<any>) {
      state.userDetail = {
        ...state.userDetail,
        ...action.payload,
      };
    },

    updateTotalUploadTrackOfLabel(state, action) {
      const { userDetail } = current(state);
      const canUploadToLabels = userDetail.canUploadToLabels.map(item => {
        if (item?._id === action.payload) {
          return {
            ...item,
            totalUploaded: item.totalUploaded + 1,
            uploaded: item.uploaded + 1,
          };
        }
        return item;
      });

      state.userDetail = {
        ...state.userDetail,
        canUploadToLabels,
      };
    },
    //UPDATE USER
    updateUserRequest(state, action: PayloadAction<UpdateUserPayload>) {
      state.error = null;
      state.isLoading = true;
      state.isUpdateUserSuccess = false;
    },
    updateUserSuccess(state, action: PayloadAction<any>) {
      state.userDetail = { ...state.userDetail, ...action.payload };
      state.isLoading = false;
      state.isUpdateUserSuccess = true;
    },
    updateUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.isUpdateUserSuccess = false;
    },

    //upload img  user
    uploadImgUserRequest(state, action: PayloadAction<uploadImgUserPayload>) {
      state.error = null;
      state.isLoading = true;
    },

    updateConfirmContributor(state, action: PayloadAction<boolean>) {
      state.isConfirmContributor = action.payload;
    },

    updateStatusDisputingUser(state, action: PayloadAction<boolean>) {
      state.isDisputing = action.payload;
    },

    uploadImgUserSuccess(state, action: PayloadAction<uploadImgUserResponse>) {
      toastSuccess('Success');
      switch (action.payload.typePic) {
        case IMG_OF_USER.AVATAR:
          state.userDetail = {
            ...state.userDetail,
            avatar: action.payload && action.payload[0]?.url,
          };
          state.isShowAvatarLoading = false;
          state.isShowCoverLoading = false;
          state.isShowPromoLoading = false;
          state.isLoading = false;

          break;
        case IMG_OF_USER.COVER_IMAGE:
          state.userDetail = {
            ...state.userDetail,
            cover: action.payload && action.payload[0]?.url,
          };
          state.isShowAvatarLoading = false;
          state.isShowCoverLoading = false;
          state.isShowPromoLoading = false;
          state.isLoading = false;

          break;
        default:
          state.userDetail = {
            ...state.userDetail,
            promoShot: action.payload && action.payload[0]?.url,
          };
          state.isShowAvatarLoading = false;
          state.isShowCoverLoading = false;
          state.isShowPromoLoading = false;
          state.isLoading = false;

          break;
      }
    },
    uploadImgUserFailure(state, action: PayloadAction<string>) {
      toastError(action.payload);
      state.error = action.payload;
    },

    setUpdateUserSuccess(state) {
      state.isUpdateUserSuccess = false;
    },
    // LOADING
    showAvatarLoading(state) {
      state.isShowAvatarLoading = true;
    },
    showCoverLoading(state) {
      state.isShowCoverLoading = true;
    },
    showPromoLoading(state) {
      state.isShowPromoLoading = true;
    },
  },
});

export const { actions: authActions } = slice;
export const actionsAuth = slice.actions;
export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSaga });
  return { actions: slice.actions };
};
