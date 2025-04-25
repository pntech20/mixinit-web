import { Undefinedable } from 'app/constants/types';
import { SignupPayload, SignupResponse } from 'app/pages/Signup/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const AUTH_BASE_URL = '/v1/mixinit/auth';

export const signup = async (
  payload: SignupPayload,
): Promise<Undefinedable<SignupResponse>> => {
  const response = await axiosService.post(`${AUTH_BASE_URL}/sign-up`, payload);

  return path<SignupResponse>(['data'], response);
};
