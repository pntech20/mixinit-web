import { COUNTRY, IP_ADDRESS } from 'app/constants';
import { Undefinedable } from 'app/constants/types';
import { getLocalStorage } from 'app/helpers/local-storage';
import {
  BuyTokenPackagePayload,
  BuyTokenPackageResponse,
  GetTokenPackagesPayload,
  GetTokenPackagesResponse,
  UnSribeSubscriptionPayload,
} from 'app/pages/Services/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const PACKAGE_BASE_URL = '/v1/packages';

export const getTokenPackages = async (
  payload: GetTokenPackagesPayload,
): Promise<Undefinedable<GetTokenPackagesResponse>> => {
  const queryParams = '_sort=price@asc';

  const response = await axiosService.get(`${PACKAGE_BASE_URL}?${queryParams}`);
  return path(['data'], response);
};

export const buyTokenPackage = async (
  payload: BuyTokenPackagePayload,
): Promise<Undefinedable<BuyTokenPackageResponse>> => {
  const { packageId, ipAddress, country, subscriptionID } = payload;
  const response = await axiosService.post(
    `${PACKAGE_BASE_URL}/${packageId}/buy`,
    {
      ipAddress,
      country,
      subscriptionID,
    },
  );
  return path(['data', 'data'], response);
};

export const unsubscribeSubscription = async (
  payload: UnSribeSubscriptionPayload,
) => {
  const { packageId } = payload;

  const response = await axiosService.post(`${PACKAGE_BASE_URL}/unSubscribe`, {
    packageId,
  });
  return path(['data', 'data'], response);
};

export const createSubscription = async planId => {
  const response = await axiosService.post(
    `${PACKAGE_BASE_URL}/create-subscription`,
    { planId, ipAddress: getLocalStorage(IP_ADDRESS) },
  );
  return path(['data'], response);
};

export const completeSubscription = async subscriptionId => {
  const response = await axiosService.post(
    `${PACKAGE_BASE_URL}/complete-subscription`,
    {
      ipAddress: getLocalStorage(IP_ADDRESS),
      country: getLocalStorage(COUNTRY),
      subscriptionId,
    },
  );
  return path(['data', 'data'], response);
};
