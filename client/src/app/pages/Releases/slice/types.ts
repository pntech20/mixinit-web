import { Nullable } from 'app/constants/types';
import { IPagination, Release, Track } from 'app/models';

/* --- STATE --- */
export interface ReleasesState {
  error: Nullable<Error | string>;
  releases: Array<Release>;
  isLoading: boolean;
  pagination: IPagination | null;
  myReleases: Array<Release>;
  release: any;
  releasesId: string;
  releasesByFeatures: Array<Release>;
  isFeaturesLoading: boolean;
  releasesBy7Days: Array<Release>;
  isLoading7Days: boolean;
  isCreateAtLoading: boolean;
  releasesByCreateAt: Array<Release>;
  isEditReleaseSuccess: boolean;
  isCreateReleaseSuccess: boolean;
  totalPage: number;
  currentPage: number;
  topReleases: Array<Release>;
  isLoadingRelease: boolean;
  listFiles: Array<Track>;
  isLoadingMore: boolean;
  isStateRelease?: boolean;
  isDeleteReleaseSuccess?: boolean;
  isShowModalDeleteRelease: boolean;
}

export interface ReleasesResponse {
  records: Array<Release>;
  pagination: IPagination;
}

export interface ReleasesResponses {
  data: Array<Release>;
  currentPage: number;
  perPage: number;
  totalData: number;
  totalPage: number;
}

export interface TopReleasesResponse {
  data: Array<Release>;
}

export interface GetReleasesPayload {
  params: string;
  filter: any;
  isLoadingMore?: boolean;
  mixinitOnly?: boolean;
}

export interface CreateReleasePayload {
  artwork: string;
  type: string;
  title: string;
  description: string;
  discountPCT: number;
  saveTokens?: number;
  tracks: Array<string>;
  enabled?: boolean;
}

export interface ReleaseDetailsResponse {
  release: Release;
}
export interface EditReleasePayload {
  releaseId: string;
  data: CreateReleasePayload;
}
