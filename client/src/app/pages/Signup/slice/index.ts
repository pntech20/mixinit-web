import { toastSuccess } from 'app/helpers/toast';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { signupSaga } from './saga';
import { SignupPayload, SignupResponse, SignupState } from './types';

export const initialState: SignupState = {
  error: null,
  isLoading: false,
  signupSuccess: false,
};

const slice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    signupRequest(state, action: PayloadAction<SignupPayload>) {
      state.signupSuccess = false;
      state.error = null;
      state.isLoading = true;
    },
    signupSuccess(state, action: PayloadAction<SignupResponse>) {
      toastSuccess('Sign up success. Please verify email your account.');
      state.signupSuccess = true;
      state.isLoading = false;
    },
    signupFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSignupSuccess(state) {
      state.signupSuccess = false;
    },
  },
});

export const { actions } = slice;

export const useSignupSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: signupSaga });
  return { actions: slice.actions };
};
