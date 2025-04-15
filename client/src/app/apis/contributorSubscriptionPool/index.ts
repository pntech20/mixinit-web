import axiosService from 'app/services/axios.service';

const SALES_BASE_URL = '/v1/contributor-subscription-pool';

export const contributorSubscriptionPool = async () => {
  const response = await axiosService.get(`${SALES_BASE_URL}`);
  return response?.data;
};
