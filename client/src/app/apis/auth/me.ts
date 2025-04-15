import { Undefinedable } from 'app/constants/types';
import { User } from 'app/models';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const USERS_ME_BASE_URL = '/users/me';

export const getMe = async (): Promise<Undefinedable<User>> => {
  const response = await axiosService.get(USERS_ME_BASE_URL);
  return path<User>(['data', 'data'], response);
};
