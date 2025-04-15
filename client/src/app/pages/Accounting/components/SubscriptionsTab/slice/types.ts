/* --- STATE --- */
import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface AccountingReleasesState {
  error: Nullable<Error | string>;
  isLoading: boolean;
  releases: AccountingReleaseItem[];
}

export type AccountingReleaseItem = {
  totalSold?: number;
  totalSubSold?: number;
  _id: string;
  name: string;
  tokenGross: number | null;
  yourCut: number | null;
  labelCut: number | null;
  createdAt: string;
};

export interface GetAccountingReleasePayload {
  params: any;
  filter: any;
}
