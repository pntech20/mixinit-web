import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface AccountingTrackState {
  error: Nullable<Error | string>;
  isLoading: boolean;
  tracks: AccountingTrackItem[];
}

export type AccountingTrackItem = {
  totalSold?: number;
  totalPayeeReceive?: number | undefined;
  totalSubPayeeReceive?: number | undefined;
  totalSubSold?: number;
  _id: string;
  name: string;
  tokenGross: number | null;
  yourCut: number | null;
  labelCut: number | null;
  createdAt: string;
};

export interface GetAccountingTrackPayload {
  params: any;
  filter: any;
}
