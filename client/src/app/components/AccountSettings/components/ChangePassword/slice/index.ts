import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { changePasswordSaga } from './saga';
import { ChangePasswordPayload, ChangePasswordState } from './types';

export const initialState: ChangePasswordState = {
  isLoading: false,
  success: false,
  errors: null,
  password: '',
  newPassword: '',
  passwordConfirmation: '',
};

const slice = createSlice({
  name: 'changepassword',
  initialState,
  reducers: {
    changePassWordRequest(state, action: PayloadAction<ChangePasswordPayload>) {
      state.success = false;
      state.isLoading = true;
    },
    changePassWordSuccess(state) {
      state.success = true;
      state.isLoading = false;
    },
    changePassWordFailed(state, action: PayloadAction<string>) {
      state.errors = action.payload;
      state.isLoading = false;
    },
    setSuccess(state) {
      state.success = false;
    },
  },
});

export const { actions } = slice;

export const useChangepasswordSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: changePasswordSaga });
  return { actions: slice.actions };
};
