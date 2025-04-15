import { Undefinedable } from 'app/constants/types';
import {
  ProceedCashOutPayload,
  ProceedCashOutResponse,
  RequestCashOutPayload,
  RequestCashOutResponse,
} from 'app/pages/CashOut/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const CASHOUT_BASE_URL = '/v1/cashout';

export const requestCashOut = async (
  payload: RequestCashOutPayload,
): Promise<Undefinedable<RequestCashOutResponse>> => {
  const response = await axiosService.post(
    `${CASHOUT_BASE_URL}/request`,
    payload,
  );
  return path(['data', 'data'], response);
};

export const proceedCashOut = async (
  payload: ProceedCashOutPayload,
): Promise<Undefinedable<ProceedCashOutResponse>> => {
  const response = await axiosService.post(
    `${CASHOUT_BASE_URL}/verify`,
    payload,
  );
  return path(['data', 'data'], response);
};
