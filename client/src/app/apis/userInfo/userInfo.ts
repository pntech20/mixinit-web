import { DATE_RANGE } from 'app/constants/enum';
import { Nullable } from 'app/constants/types';
import { User } from 'app/models';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const USER_BASE_URL = '/v1/users';
const RELEASE_BASE_URL = '/v1/releases';

export const getUserBySlug = async (payload): Promise<Nullable<User>> => {
  const response = await axiosService.get(
    `${USER_BASE_URL}/findUserBySlug/${payload.slug}`,
  );
  return response?.data.data;
};

export const getTopContributors = async payload => {
  const params = {
    dateRange: payload?.dateRange ?? DATE_RANGE.ALL_TIME,
    labelId: payload?.labelId,
  };
  const response = await axiosService.post(`${USER_BASE_URL}/top`, params);

  return path(['data', 'data'], response);
};

export const getUsersHaveRelease = async () => {
  const response = await axiosService.get(
    `${RELEASE_BASE_URL}/users/have-release`,
  );

  return path(['data', 'data'], response);
};

export const getContributorCanUploadToAtLeastOneLabel = async () => {
  const response = await axiosService.get(
    `${USER_BASE_URL}/contributors-can-upload-to-at-least-one-label`,
  );
  return path(['data', 'data', 'data'], response);
};
