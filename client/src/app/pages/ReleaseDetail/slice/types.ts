import { Release, Track } from 'app/models';
import { Nullable } from 'app/constants/types';

/* --- STATE --- */
export interface ReleaseDetailState {
  releaseDetail: any;
  isLoading: boolean;
  error: Nullable<Error | string>;
  tracksByReleaseId: Array<Track>;
  releasesUser: Array<Release>;
  isLoadingTrack: boolean;
  isLoadingTrackByReleaseId: boolean;
}
export interface ReleaseDetailsPayload {
  _id: string;
}

export interface ReleaseDetailsResponse {
  release: Release;
}
