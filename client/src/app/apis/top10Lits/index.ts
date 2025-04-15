import axiosService from 'app/services/axios.service';

export const getTopTrackDetail = async (
  id: string,
  param?: string,
  payload?: any,
) => {
  const response = await axiosService.post(
    `/v1/tracks/top-track/${id}?key=${param}`,
    payload,
  );

  return response?.data.data;
};

export const getTopReleaseByLabelDetail = async (
  id: string,
  param?: string,
) => {
  const response = await axiosService.get(
    `/v1/labels/top-release/${id}?dateRange=${param}`,
  );

  return response?.data.data;
};

export const getTopReleaseByContributorDetail = async (
  id: string,
  param?: string,
) => {
  const response = await axiosService.get(
    `/v1/users/top-release/${id}?dateRange=${param}`,
  );

  return response?.data.data;
};
