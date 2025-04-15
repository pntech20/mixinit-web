import { Nullable } from 'app/constants/types';
import { User } from 'app/models';

/* --- STATE --- */
export interface SignupState {
  error: Nullable<Error | string>;
  isLoading: boolean;
  signupSuccess: boolean;
}

export interface SignupPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  accessToken: string;
  user: User;
}
