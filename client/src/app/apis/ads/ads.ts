import axiosService from 'app/services/axios.service';
const ADS_BASE_URL = '/v1/ads';

export const onCreateAds = async (payload: any): Promise<any> => {
  const response = await axiosService.post(`${ADS_BASE_URL} `, payload);
  return response?.data?.data;
};

export const getMyAds = async (): Promise<any> => {
  const response = await axiosService.get(`${ADS_BASE_URL} `);
  return response?.data?.data;
};

export const getMyAdsApprove = async (): Promise<any> => {
  const response = await axiosService.get(`${ADS_BASE_URL}/adsApproved `);
  return response?.data?.data;
};

export const getListAds = async (): Promise<any> => {
  const response = await axiosService.get(`${ADS_BASE_URL}/list `);
  return response?.data?.data;
};

export const onCancelAds = async (idAds): Promise<any> => {
  const response = await axiosService.put(`${ADS_BASE_URL}/${idAds} `);
  return response?.data?.data;
};

export const incrementAdClickCount = async (idAds): Promise<any> => {
  await axiosService.get(`${ADS_BASE_URL}/count/${idAds} `);
};
