import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const REQUEST_BASE_URL = '/v1/requests';

export const createRequest = async payload => {
  const response = await axiosService.post(REQUEST_BASE_URL, payload);

  return path(['data'], response);
};
