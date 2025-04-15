import { Undefinedable } from 'app/constants/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import {
  GetStoragePlansResponse,
  SubscribeStoragePlayload,
  SubscribeStorageResponse,
  UnsubscribeStorageResponse,
} from './../../pages/Services/slice/types';

const STORAGE_BASE_URL = '/v1/storages';

export const getStoragePlans = async (
  // TODO: payload will have query params
  payload: null,
): Promise<Undefinedable<GetStoragePlansResponse>> => {
  const queryParams = '_sort=price@ASC';
  const response = await axiosService.get(`${STORAGE_BASE_URL}?${queryParams}`);

  return path(['data'], response.data);
};

export const subscribeStorage = async (
  payload: SubscribeStoragePlayload,
): Promise<Undefinedable<SubscribeStorageResponse>> => {
  const { storageId, paypalOrderId, paypalStorageSubscriptionId } = payload;
  const response = await axiosService.post(
    `${STORAGE_BASE_URL}/${storageId}/subscribe`,
    {
      paypalOrderId,
      paypalStorageSubscriptionId,
    },
  );
  return path(['data', 'data'], response);
};

export const unsubscribeStorage = async (): Promise<
  Undefinedable<UnsubscribeStorageResponse>
> => {
  const response = await axiosService.post(
    `${STORAGE_BASE_URL}/me/unsubscribe`,
    {},
  );
  return path(['data', 'data'], response);
};
