import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface AccountingState {
  error: Nullable<Error | string>;
  isLoading: boolean;
  labels: AccountingLabelItem[];
}

export type AccountingLabelItem = {
  _id: string;
  name: string;
  label: LabelDetail;
  quota: number;
  split: number;
  startDate: string;
  endDate: string;
  uploads: number;
  maxUpload: number;
  metQuota: boolean;
  tracksSold: number | null;
  tokenGross: number | null;
  yourCut: number | null;
  labelCut: number | null;
  createdAt: string;
  numberSubscriptions?: number;
  tokenGrossSubscription?: number;
  isAlreadyPayout?: boolean;
  dayPaid?: string;
  paypalEmailPaid?: string;
};

export type AccountingTrackItem = {
  _id: string;
  name: string;
  tokenGross: number | null;
  yourCut: number | null;
  labelCut: number | null;
  createdAt: string;
};

export type AccountingReleaseItem = {
  _id: string;
  name: string;
  tokenGross: number | null;
  yourCut: number | null;
  labelCut: number | null;
  createdAt: string;
};

export type AccountingCountryItem = {
  country: string;
  totalSold: number;
};

export type LabelDetail = {
  _id: string;
  name: string;
  slug: string;
  squareImageUrl: string;
  bannerImageUrl: string;
};

export interface GetAccountingPayload {
  params: any;
  filter: any;
}
