import { Nullable } from 'app/constants/types';
import { LoginPayload, LoginResponse } from 'app/pages/Login/slice/types';
import axiosService from 'app/services/axios.service';

const BASE_AUTH_URL = '/v1/auth';

export const login = async (
  payload: LoginPayload,
): Promise<Nullable<LoginResponse>> => {
  const response = await axiosService.post(`${BASE_AUTH_URL}/login`, payload);

  return response?.data;
};
