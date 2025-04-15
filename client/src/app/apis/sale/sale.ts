import { Nullable } from 'app/constants/types';
import axiosService from 'app/services/axios.service';

const SALES_BASE_URL = '/v1/sales';

export const getSales = async (payload: {
  selectedTime: number;
}): Promise<Nullable<{ data: Array<any> }>> => {
  const response = await axiosService.post(`${SALES_BASE_URL}`, payload);
  return response?.data.data;
};

export const getSummary = async (payload: {
  selectedTime: number;
}): Promise<Nullable<{ data: Array<any> }>> => {
  const response = await axiosService.post(
    `${SALES_BASE_URL}/summary`,
    payload,
  );
  return response?.data.data;
};
