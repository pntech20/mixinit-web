import { Undefinedable } from 'app/constants/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import {
  GetSubscriptionTiersResponse,
  SubscribeTierPlayload,
  SubscribeTierResponse,
  UnsubscribeTierResponse,
} from './../../pages/Services/slice/types';

const TIER_BASE_URL = '/v1/tiers';

export const getSubscriptionTiers = async (
  // TODO: payload will have query params
  payload: null,
): Promise<Undefinedable<GetSubscriptionTiersResponse>> => {
  const queryParams = '_sort=price@asc';
  const response = await axiosService.get(`${TIER_BASE_URL}?${queryParams}`);
  return path(['data'], response.data);
};

export const subscribeTier = async (
  payload: SubscribeTierPlayload,
): Promise<Undefinedable<SubscribeTierResponse>> => {
  const { tierId, paypalOrderId, paypalTierSubscriptionId } = payload;
  const response = await axiosService.post(
    `${TIER_BASE_URL}/${tierId}/subscribe`,
    {
      paypalOrderId,
      paypalTierSubscriptionId,
    },
  );
  return path(['data', 'data'], response);
};

export const unsubscribeTier = async (): Promise<
  Undefinedable<UnsubscribeTierResponse>
> => {
  const response = await axiosService.post(
    `${TIER_BASE_URL}/me/unsubscribe`,
    {},
  );
  return path(['data', 'data'], response);
};
