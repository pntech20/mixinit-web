import { Nullable } from 'app/constants/types';
import { User } from 'app/models';

export interface StreamChatInfo {
  avatar: string;
  email: string;
  _id: string;
  token: string;
  username: string;
}

/* --- STATE --- */
export interface AuthState {
  isAuthenticated: boolean;
  isSessionFetched: boolean;
  accessToken: Nullable<string>;
  refreshToken: string;
  error: Nullable<Error | string>;
  isLoading: boolean;
  userDetail: any;
  isShowAvatarLoading: boolean;
  isShowCoverLoading: boolean;
  isShowPromoLoading: boolean;
  isUpdateUserSuccess: boolean;
  isConfirmContributor: boolean;
  isDisputing: boolean;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  needToConfirmContributor?: boolean;
  isContributor?: boolean;
}

export interface GetMeResponse {
  user: User;
}

export interface GoogleAuthenticatePayload {
  token: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  address?: string;
  streetAddress?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  biography?: string;
  paypalEmail?: string;
  dateOfBirth?: string;
  avatar?: string;
  gender?: string;
  cover?: string;
  promoShot?: string;
  bannerBgColor?: string;
  bannerTextColor?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  spotifyUrl?: string;
  mixcloudUrl?: string;
  facebookUrl?: string;
  showTrackPurchases?: boolean;
  showMyOwnTracks?: boolean;
  // isShowTrackPurchased?: boolean;
}

export interface uploadImgUserPayload {
  file: File;
  path?: string;
  typePic: string;
}

export interface uploadImgUserResponse {
  user: User;
  typePic: string;
}

export interface UpdateUserResponse {
  showTrackPurchases: boolean;
  showMyOwnTracks: boolean;
}
