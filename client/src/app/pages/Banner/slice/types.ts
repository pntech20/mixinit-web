import { Nullable } from 'app/constants/types';
import { Banner } from 'app/models';

/* --- STATE --- */
export interface BannerState {
  banners: Array<Banner>;
  error: Nullable<Error | string>;
}

export interface BannerResponse {
  data: Banner[];
}
