import {
  CommunityPayload,
  CommunityResponse,
} from 'app/components/Community/slice/types';
import { Nullable } from 'app/constants/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const BASE_USER_URL = '/v1/users';
const BASE_AUTH_URL = '/v1/auth';

export const confirmVerifyEmail = async payload => {
  try {
    const response = await axiosService.post(
      `${BASE_AUTH_URL}/email-confirmation`,
      payload,
    );

    return response?.data;
  } catch (error) {
    return error;
  }
};

export const bulkCreateUsers = async data => {
  const response = await axiosService.post(
    `${BASE_USER_URL}/bulk/create`,
    data,
  );
  return response?.data;
};

export const bulkCreateTracks = async data => {
  const response = await axiosService.post('/v1/tracks/bulk/create', data);
  return response?.data;
};

export const getContributors = async (
  payload: CommunityPayload,
): Promise<Nullable<CommunityResponse>> => {
  const filter = payload?.filter || {};
  const response = await axiosService.post(
    `${BASE_USER_URL}/contributors`,
    filter,
  );
  return response?.data;
};

export const getListUsersIsContributor = async () => {
  const response = await axiosService.post(
    `${BASE_USER_URL}/listContributors`,
    { sort: '' },
  );

  return path(['data', 'data'], response);
};

export const updateUserContributor = async payload => {
  const response = await axiosService.put(
    `${BASE_USER_URL}/contributor`,
    payload,
  );
  return path(['data', 'data'], response);
};
