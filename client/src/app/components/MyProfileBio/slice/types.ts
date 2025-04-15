import { Nullable } from 'app/constants/types';
import { User } from 'app/models';

/* --- STATE --- */
export interface UserInfoState {
  userDetails: any;
  isLoading: boolean;
  error: Nullable<Error | string>;
}

export interface GetUserByUsernamePayload {
  username: string;
}

export interface GetUserByUsernameResponse {
  userDetail: Nullable<User>;
}

export interface GetTopContributorsQuery {
  limit?: number;
  dateRange?: string;
}
