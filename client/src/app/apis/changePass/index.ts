import {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from 'app/components/AccountSettings/components/ChangePassword/slice/types';
import { Undefinedable } from 'app/constants/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const USERS_ME_BASE_URL = '/v1/users';

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<Undefinedable<ChangePasswordResponse>> => {
  const response = await axiosService.put(
    `${USERS_ME_BASE_URL}/change-password`,
    payload,
  );

  return path(['data', 'data'], response);
};
