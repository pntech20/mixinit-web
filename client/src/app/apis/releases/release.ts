import { COUNTRY, IP_ADDRESS } from 'app/constants';
import { Nullable, Undefinedable } from 'app/constants/types';
import { getLocalStorage } from 'app/helpers/local-storage';
import { Track } from 'app/models';
import {
  CreateReleasePayload,
  EditReleasePayload,
  GetReleasesPayload,
  ReleaseDetailsResponse,
  TopReleasesResponse,
} from 'app/pages/Releases/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import { ReleasesResponse } from '../../pages/Releases/slice/types';

const RELEASE_BASE_URL = '/v1/releases';

export const getReleases = async (
  payload: GetReleasesPayload,
): Promise<Nullable<ReleasesResponse> | undefined> => {
  const queryParams = payload?.params || '';
  const filter = payload?.filter || {};
  const response = await axiosService.post(
    `${RELEASE_BASE_URL}/search?${queryParams}`,
    filter,
  );
  return path<ReleasesResponse>(['data', 'data'], response);
};

export const getTopReleases = async (payload: {
  selectedTime: number;
}): Promise<Nullable<TopReleasesResponse>> => {
  const response = await axiosService.post(`${RELEASE_BASE_URL}/top`, payload);
  return response?.data.data;
};

export const checkExistedTitleRelease = async (title, releaseId = '') => {
  const response = await axiosService.post(
    `${RELEASE_BASE_URL}/check-existed/title`,
    { title, releaseId },
  );
  return response?.data.data;
};

export const createRelease = async (
  payload: CreateReleasePayload,
): Promise<Undefinedable<ReleaseDetailsResponse>> => {
  const response = await axiosService.post(RELEASE_BASE_URL, payload);
  return path<ReleaseDetailsResponse>(['data', 'data'], response);
};

export const updateRelease = async (
  payload: EditReleasePayload,
): Promise<Undefinedable<ReleaseDetailsResponse>> => {
  const response = await axiosService.put(
    `${RELEASE_BASE_URL}/${payload.releaseId}`,
    payload.data,
  );

  return path<ReleaseDetailsResponse>(['data', 'data'], response);
};

export const getReleaseById = async (
  payload,
): Promise<Undefinedable<ReleaseDetailsResponse>> => {
  const response = await axiosService.get(`${RELEASE_BASE_URL}/${payload._id}`);

  return path(['data', 'data'], response);
};

export const getTrackByReleaseById = async (
  payload,
): Promise<Undefinedable<Array<Track>>> => {
  const response = await axiosService.post(
    `${RELEASE_BASE_URL}/${payload._id}/tracks`,
    { sort: payload.sort },
  );

  return path(['data', 'data'], response);
};

export const buyRelease = async (payload: any): Promise<any | undefined> => {
  const releaseId = payload?.releaseId;
  const response = await axiosService.post(
    `${RELEASE_BASE_URL}/${releaseId}/buy`,
    {
      ipAddress: getLocalStorage(IP_ADDRESS),
      country: getLocalStorage(COUNTRY),
    },
  );

  return path<any>(['data', 'data'], response);
};

export const addTrackToMyRelease = async payload => {
  const response = await axiosService.post(
    `${RELEASE_BASE_URL}/add-track`,
    payload,
  );
  return response?.data;
};

export const deleteRelease = async payload => {
  const response = await axiosService.delete(
    `${RELEASE_BASE_URL}/${payload.releaseId}`,
  );

  return path(['data', 'data'], response);
};
