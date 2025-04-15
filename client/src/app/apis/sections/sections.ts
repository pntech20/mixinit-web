import { Nullable } from 'app/constants/types';
import {
  getLabelDetailPayload,
  getLabelDetailResponse,
  GetSectionsPayload,
  SectionsResponse,
} from 'app/pages/Sections/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const SECTION_BASE_URL = '/v1/sections';
const SECTION_ME_BASE_URL = `${SECTION_BASE_URL}/me`;
const LABEL_BASE_URL = '/v1/labels';

export const getSections = async (
  payload: GetSectionsPayload,
): Promise<Nullable<SectionsResponse> | undefined> => {
  const queryParams = payload?.params || '';
  const response = await axiosService.post(
    `${LABEL_BASE_URL}/search?${queryParams}`,
    payload.filter,
  );
  return path<SectionsResponse>(['data', 'data'], response);
};

export const getTopLabels = async (payload: {
  selectedTime: number;
}): Promise<Nullable<SectionsResponse>> => {
  const response = await axiosService.post(`${LABEL_BASE_URL}/top`, payload);
  return response?.data.data;
};

export const checkContributorCanUpload = async (labelId: string) => {
  const response = await axiosService.get(`${LABEL_BASE_URL}/check/${labelId}`);
  return response?.data?.data;
};

export const getAllLabels = async () => {
  const response = await axiosService.get(`${LABEL_BASE_URL}`);
  return response?.data.data;
};

export const getLabelDetail = async (
  payload: getLabelDetailPayload,
): Promise<Nullable<getLabelDetailResponse>> => {
  const response = await axiosService.get(
    `${LABEL_BASE_URL}/${payload.labelId}`,
  );

  return response?.data.data;
};

export const getReleasePricingByLabelId = async (
  id: string,
): Promise<Nullable<any>> => {
  const response = await axiosService.get(
    `${LABEL_BASE_URL}/release-pricing/${id}`,
  );

  return response?.data.data;
};

export const getMySection = async (
  payload: null,
): Promise<Nullable<SectionsResponse> | undefined> => {
  const response = await axiosService.get(`${SECTION_ME_BASE_URL}/my-section`);

  return path<SectionsResponse>(['data', 'data'], response);
};
