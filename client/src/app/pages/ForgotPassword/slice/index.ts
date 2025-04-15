import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { forgotPasswordSaga } from './saga';
import {
  ForgotPasswordPayload,
  ForgoAndResettPasswordResponse,
  ForgotPasswordState,
  ResetPasswordPayload,
} from './types';

export const initialState: ForgotPasswordState = {
  isLoading: false,
  sentEmailSuccess: false,
  error: null,
  resetPasswordSuccess: false,
};

const slice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    forgotPasswordRequest(state, action: PayloadAction<ForgotPasswordPayload>) {
      state.isLoading = true;
      state.sentEmailSuccess = false;
      state.error = null;
    },
    forgotPasswordSuccess(
      state,
      action: PayloadAction<ForgoAndResettPasswordResponse>,
    ) {
      state.isLoading = false;
      state.sentEmailSuccess = true;
    },
    forgotPasswordFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    resetPasswordRequest(state, action: PayloadAction<ResetPasswordPayload>) {
      state.isLoading = true;
      state.resetPasswordSuccess = false;
      state.error = null;
    },
    resetPasswordSuccess(
      state,
      action: PayloadAction<ForgoAndResettPasswordResponse>,
    ) {
      state.isLoading = false;
      state.resetPasswordSuccess = true;
    },
    resetPasswordFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { actions } = slice;

export const useForgotPasswordSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: forgotPasswordSaga });
  return { actions: slice.actions };
};
