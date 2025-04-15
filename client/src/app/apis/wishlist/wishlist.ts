import { COUNTRY, IP_ADDRESS } from 'app/constants';
import { getLocalStorage } from 'app/helpers/local-storage';
import axiosService from 'app/services/axios.service';

const WISHLIST_BASE_URL = '/v1/wishlists';

export const getMyWishlist = async () => {
  const response = await axiosService.get(`${WISHLIST_BASE_URL}/me`);
  return response?.data?.data;
};

export const checkoutMyWishlist = async payload => {
  const response = await axiosService.post(
    `${WISHLIST_BASE_URL}/checkout`,
    payload,
  );
  return response?.data?.data;
};

export const addTrackToMyWishlist = async trackId => {
  const response = await axiosService.post(`${WISHLIST_BASE_URL}/add-tracks`, {
    id: trackId,
  });
  return response?.data?.data;
};

export const addReleaseToMyWishlist = async releaseId => {
  const response = await axiosService.post(
    `${WISHLIST_BASE_URL}/add-releases`,
    {
      id: releaseId,
    },
  );
  return response?.data?.data;
};

export const removeTrackToMyWishlist = async trackIds => {
  const response = await axiosService.post(
    `${WISHLIST_BASE_URL}/remove-tracks`,
    { trackIds },
  );
  return response?.data?.data;
};

export const removeReleaseToMyWishlist = async releaseIds => {
  const response = await axiosService.post(
    `${WISHLIST_BASE_URL}/remove-releases`,
    { releaseIds },
  );
  return response?.data?.data;
};

export const handleCreateOrder = async () => {
  const response = await axiosService.get(`${WISHLIST_BASE_URL}/create-order`);
  return response?.data;
};

export const onCompleteOrder = async orderId => {
  const response = await axiosService.post(
    `${WISHLIST_BASE_URL}/complete-order/${orderId}`,
    {
      ipAddress: getLocalStorage(IP_ADDRESS),
      country: getLocalStorage(COUNTRY),
    },
  );
  return response?.data?.data;
};
