import { Nullable } from 'app/constants/types';
import { LoginResponse } from 'app/pages/Login/slice/types';
import axiosService from 'app/services/axios.service';

const BASE_AUTH_URL = '/v1/mixinit/auth';

export const authenticateWithDropbox = async (
  authCode: string,
): Promise<Nullable<LoginResponse>> => {
  const response = await axiosService.post(`${BASE_AUTH_URL}/dropbox`, {
    authCode,
  });

  return response?.data;
};
