import { Nullable } from 'app/constants/types';
import {
  GetTagsPayload,
  GetTopTagsQuery,
  TagsResponse,
} from 'app/pages/Tags/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import queryString from 'query-string';

const TAG_BASE_URL = '/v1/tags';

export const getTags = async (
  payload: GetTagsPayload,
): Promise<Nullable<TagsResponse> | undefined> => {
  const params = {
    search: payload?.search,
    sort: payload?.sort,
  };
  const query = queryString.stringify(params);
  const response = await axiosService.get(`${TAG_BASE_URL}?${query}`);

  return path<TagsResponse>(['data', 'data'], response);
};

export const getTagDetail = async (
  payload: GetTagsPayload,
): Promise<Nullable<TagsResponse> | undefined> => {
  const response = await axiosService.get(`${TAG_BASE_URL}/${payload}`);
  return path<TagsResponse>(['data', 'data'], response);
};

export const getTopTags = async (payload: GetTopTagsQuery) => {
  const params = {
    dateRange: payload?.dateRange,
    labelId: payload?.labelId,
  };
  const response = await axiosService.post(`${TAG_BASE_URL}/top`, params);

  return path<TagsResponse>(['data', 'data'], response);
};
