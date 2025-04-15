import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const DISCOUNT_BASE_URL = '/v1/discounts';

export const getDiscountApi = async param => {
  const response = await axiosService.get(`${DISCOUNT_BASE_URL}?type=${param}`);
  return path(['data', 'data'], response);
};
