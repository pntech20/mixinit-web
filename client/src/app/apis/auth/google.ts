import { Nullable } from 'app/constants/types';
import {
  GoogleAuthenticatePayload,
  LoginResponse,
} from 'app/pages/Login/slice/types';
import axiosService from 'app/services/axios.service';

const BASE_AUTH_URL = '/v1/mixinit/auth';

export const authenticateWithGoogle = async (
  payload: GoogleAuthenticatePayload,
): Promise<Nullable<LoginResponse>> => {
  const response = await axiosService.post(`${BASE_AUTH_URL}/google`, payload);

  return response?.data;
};
