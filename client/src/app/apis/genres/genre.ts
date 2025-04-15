import { Nullable } from 'app/constants/types';
import {
  GenresResponse,
  GetGenresPayload,
  GetTopGenresQuery,
} from 'app/pages/Genres/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import queryString from 'query-string';

const GENRES_BASE_URL = '/v1/genres';

export const getGenres = async (
  payload: GetGenresPayload,
): Promise<Nullable<GenresResponse> | undefined> => {
  const params = {
    search: payload?.search,
    sort: payload?.sort,
  };
  const query = queryString.stringify(params);
  const response = await axiosService.get(`${GENRES_BASE_URL}?${query}`);
  return path<GenresResponse>(['data', 'data'], response);
};

export const getGenreDetail = async (
  payload: GetGenresPayload,
): Promise<Nullable<GenresResponse> | undefined> => {
  const response = await axiosService.get(`${GENRES_BASE_URL}/${payload}`);
  return path<GenresResponse>(['data', 'data'], response);
};

export const getTopGenres = async (payload: GetTopGenresQuery) => {
  const params = {
    dateRange: payload.dateRange,
    labelId: payload?.labelId,
  };
  const response = await axiosService.post(`${GENRES_BASE_URL}/top`, params);
  return path<GenresResponse>(['data', 'data'], response);
};
