import { Nullable } from 'app/constants/types';
import {
  ForgotPasswordPayload,
  ForgoAndResettPasswordResponse,
  ResetPasswordPayload,
} from 'app/pages/ForgotPassword/slice/types';
import axiosService from 'app/services/axios.service';

const AUTH_BASE_URL = '/v1/auth';

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<Nullable<ForgoAndResettPasswordResponse>> => {
  const response = await axiosService.post(
    `${AUTH_BASE_URL}/forgot-password`,
    payload,
  );

  return response?.data;
};
export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<Nullable<ForgoAndResettPasswordResponse>> => {
  const response = await axiosService.put(
    `${AUTH_BASE_URL}/reset-password`,
    payload,
  );

  return response?.data;
};
