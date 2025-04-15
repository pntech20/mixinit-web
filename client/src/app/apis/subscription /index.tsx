import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const BASE_SUBSCRIPTION_URL = '/v1/subscription-applications';
const BASE_CONTRIBUTOR_SUBSCRIPTION_URL =
  '/v1/contributor-subscription-purchase';
const BASE_SUBSCRIPTION_TRANSACTION_URL = '/v1/subscription-transaction';

export const updateSubscription = async payload => {
  const response = await axiosService.post(`${BASE_SUBSCRIPTION_URL}`, payload);
  return path(['data', 'data'], response);
};

export const getSubscription = async payload => {
  const response = await axiosService.post(
    `${BASE_CONTRIBUTOR_SUBSCRIPTION_URL}`,
    payload,
  );
  return path(['data', 'data'], response);
};

export const getMySubscriptionTransaction = async () => {
  const response = await axiosService.get(
    `${BASE_SUBSCRIPTION_TRANSACTION_URL}`,
  );
  return path(['data', 'data'], response);
};

export const checkUserCanSubscribe = async () => {
  const response = await axiosService.get(
    `${BASE_SUBSCRIPTION_TRANSACTION_URL}/check-can-subscribe`,
  );
  return path(['data', 'data'], response);
};
