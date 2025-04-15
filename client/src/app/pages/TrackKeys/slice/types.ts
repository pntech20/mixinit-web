import { Nullable } from 'app/constants/types';
import { TrackKey } from 'app/models';

/* --- STATE --- */
export interface TrackKeysState {
  error: Nullable<Error | string>;
  trackKeys: Array<TrackKey>;
}
export interface GetTrackKeysPayload {
  limit: number;
}
export interface TrackKeysResponse {
  trackKeys: Array<TrackKey>;
}
