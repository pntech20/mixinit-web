import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import { Undefinedable } from 'app/constants/types';
import {
  CrateResponse,
  CreateCratePayload,
  DeleteCratePayload,
  EditCratePayload,
  GetListCratesPayload,
  ListCratesResponse,
} from 'app/pages/PageCrate/slice/types';

const CRATES_BASE_URL = '/v1/crates';

const getListCrates = async (
  payload: GetListCratesPayload,
): Promise<Undefinedable<ListCratesResponse>> => {
  const query = `?type=${payload.type}`;
  const response = await axiosService.get(`${CRATES_BASE_URL}/${query}`);

  return path<ListCratesResponse>(['data', 'data'], response);
};

const getMyCrates = async (
  payload,
): Promise<Undefinedable<ListCratesResponse>> => {
  const response = await axiosService.get(`${CRATES_BASE_URL}/me`);

  return path<ListCratesResponse>(['data', 'data'], response);
};

const getQuicklinks = async (): Promise<Undefinedable<any>> => {
  const response = await axiosService.get(`${CRATES_BASE_URL}/quickLinks`);

  return path<ListCratesResponse>(['data', 'data'], response);
};

const createCrate = async (
  payload: CreateCratePayload,
): Promise<Undefinedable<CrateResponse>> => {
  const response = await axiosService.post(CRATES_BASE_URL, payload);

  return path<CrateResponse>(['data', 'data'], response);
};

const updateCrate = async (
  payload: EditCratePayload,
): Promise<Undefinedable<CrateResponse>> => {
  delete payload.user;
  const id = payload._id;
  delete payload._id;
  const response = await axiosService.put(`${CRATES_BASE_URL}/${id}`, payload);
  return path<CrateResponse>(['data', 'data'], response);
};

const deleteCrate = async (
  payload: DeleteCratePayload,
): Promise<Undefinedable<CrateResponse>> => {
  const response = await axiosService.delete(
    `${CRATES_BASE_URL}/${payload.crateId}`,
  );

  return path<CrateResponse>(['data', 'data'], response);
};

const checkExistedCrateName = async (name, crateId = '') => {
  const response = await axiosService.post(
    `${CRATES_BASE_URL}/check-existed/name`,
    { name, crateId },
  );
  return response?.data.data;
};

export {
  getListCrates,
  createCrate,
  updateCrate,
  getMyCrates,
  deleteCrate,
  checkExistedCrateName,
  getQuicklinks,
};
