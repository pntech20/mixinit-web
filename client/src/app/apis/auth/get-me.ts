import { Undefinedable } from 'app/constants/types';
import { User } from 'app/models';
import {
  UpdateUserPayload,
  UpdateUserResponse,
} from 'app/pages/Login/slice/types';

import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const USERS_ME_BASE_URL = '/v1/users/me';

// declare global {
//   interface Window {
//     hj: any;
//   }
// }

export const getMe = async (): Promise<Undefinedable<User>> => {
  const response = await axiosService.get(USERS_ME_BASE_URL);
  // const user = response?.data?.data;
  // Hotjar identify
  // if (user && window?.hj)
  //   window.hj('identify', user?.email, {
  //     firstName: user?.firstName,
  //     lastName: user?.lastName,
  //     username: user?.username,
  //     role: user?.role,
  //     _id: user?._id,
  //   });
  return path<User>(['data', 'data'], response);
};

export const updateUser = async (
  payload: UpdateUserPayload,
): Promise<Undefinedable<UpdateUserResponse>> => {
  const response = await axiosService.put(USERS_ME_BASE_URL, payload);
  return path(['data', 'data'], response);
};
