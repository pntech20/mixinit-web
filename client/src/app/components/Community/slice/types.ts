import { Nullable } from 'app/constants/types';
import { IPagination, User } from 'app/models';

/* --- STATE --- */
export interface CommunityState {
  users: Array<User>;
  contributors: Array<User>;
  topContributors: Array<User>;
  isLoading: boolean;
  error: Nullable<Error | string>;
  pagination: null | IPagination;
  isLoadingFollow: boolean;
  isLoadingMore: boolean;
  isLoadingTopContributor: boolean;
  currentPage: number;
  totalPage: number;
  topContributorsCache: any;
}

export interface filterCommunity {
  sort: string;
  page?: number;
  pageSize?: number;
  labelId?: string;
  search?: any;
}
export interface CommunityPayload {
  filter: any;
}
export interface CommunitysResponse {
  data: Array<User>;
  currentPage: number;
  perPage: number;
  totalData: number;
  totalPage: number;
  filter: any;
}

export interface CommunityResponse {
  records: User[];
  pagination: IPagination;
  followedByMe: boolean;
}

export interface ToggleBlockUserPayload {
  _id: string;
}
