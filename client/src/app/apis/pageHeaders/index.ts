import axiosService from 'app/services/axios.service';

const PAGE_HEADER_BASE_URL = '/v1/page-headers';

export const getPageHeaderApi = async () => {
  const response = await axiosService.get(`${PAGE_HEADER_BASE_URL}`);
  return response?.data;
};
