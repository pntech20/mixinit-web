import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const QUESTION_BASE_URL = '/v1/questions';

export const createQuestion = async payload => {
  const response = await axiosService.post(QUESTION_BASE_URL, payload.data);

  return path(['data'], response);
};
