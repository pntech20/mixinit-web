import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface CashOutsState {
  error: Nullable<Error | string>;
  isLoading: boolean;
  requestedCashoutSuccess: boolean;
  proceedCashoutSuccess: boolean;
  isLoadingProceed: boolean;
}

export interface RequestCashOutPayload {
  tokens: number;
}

export interface RequestCashOutResponse {
  requestedCashoutSuccess: boolean;
}

export interface ProceedCashOutPayload {
  cashoutOTP: number;
}
export interface ProceedCashOutResponse {
  proceedCashoutSuccess: boolean;
}
