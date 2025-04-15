import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface ForgotPasswordState {
  error: Nullable<Error | string>;
  isLoading: boolean;
  sentEmailSuccess: boolean;
  resetPasswordSuccess: boolean;
}

export type ForgotPasswordPayload = {
  email: string;
};

export interface ForgoAndResettPasswordResponse {
  ok: boolean;
}

export type ResetPasswordPayload = {
  password: string;
  passwordConfirmation: string;
  token: string;
};

export type InvitationPayload = {
  _id: string;
};
