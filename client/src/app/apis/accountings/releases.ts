import { Nullable } from 'app/constants/types';
import {
  AccountingLabelItem,
  GetAccountingPayload,
} from 'app/pages/Accounting/slice/types';
import axiosService from 'app/services/axios.service';

const ACCOUNTING_BASE_URL = '/v1/accounting';

export const getReleasesAccounting = async (
  payload: GetAccountingPayload,
): Promise<Nullable<AccountingLabelItem[]>> => {
  const response = await axiosService.post(`${ACCOUNTING_BASE_URL}/releases`, {
    ...payload.filter,
  });

  return response?.data.data;
};
