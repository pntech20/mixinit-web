import axiosService from 'app/services/axios.service';

const ACCOUNTING_BASE_URL = '/v1/orders';

export const getOrder = async (payload: any): Promise<any> => {
  const searchQuery = encodeURIComponent(payload.search);
  const response = await axiosService.get(
    `${ACCOUNTING_BASE_URL}?search=${searchQuery}`,
  );
  return response;
};
