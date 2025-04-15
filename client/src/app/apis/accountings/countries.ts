import { Nullable } from 'app/constants/types';
import {
  AccountingCountryItem,
  GetAccountingPayload,
} from 'app/pages/Accounting/slice/types';
import axiosService from 'app/services/axios.service';

const ACCOUNTING_BASE_URL = '/v1/accounting';

export const getCountryAccounting = async (
  payload: GetAccountingPayload,
): Promise<Nullable<AccountingCountryItem[]>> => {
  const response = await axiosService.post(`${ACCOUNTING_BASE_URL}/countries`, {
    ...payload.filter,
  });

  return response?.data.data;
};
