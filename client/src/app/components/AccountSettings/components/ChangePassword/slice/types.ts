import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface ChangePasswordState {
  errors: Nullable<Error | string>;
  isLoading: boolean;
  success: boolean;
  password: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
  currentPassword: string;
  passwordConfirmation: string;
}

export interface ChangePasswordResponse {}
