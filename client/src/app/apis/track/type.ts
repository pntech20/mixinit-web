import { Track, TrackKey } from 'app/models/index';
import { Nullable } from 'app/constants/types';

export interface TracksFilter {
  showAudio?: boolean;
  showVideo?: boolean;
  dateRange?: string;
  sort?: string;
  rules?: Array<any>;
  username?: Nullable<string>;
  showTags?: boolean;
  showGenres?: boolean;
  showTrackKeys?: boolean;
  showSections?: boolean;
  userId?: string;
  bpmFrom: number;
  bpmTo: number;
  yearFrom: number;
  yearTo: number;
  priceFrom: number;
  priceTo: number;
}

export interface GetTrackFilter {
  checkAudio?: any;
  checkVideo?: any;
  dateRange?: string | number;
  search?: any;
  sort?: string;
}
export interface TracksResponse {
  records: Array<Track>;
  pagination: any;
}

export interface TopTracksResponse {
  data: Array<Track>;
}

export interface TracksPayload {
  params: string;
  filter: TracksFilter;
}

export interface TrackDetailPayload {
  slug: string;
}

export interface TrackDetailResponse {
  trackDetailPage: Track;
}

export interface TrackUploadPayload {
  params: string;
  filter: TracksFilter;
}

export interface TrackUploadResponse {
  records: Array<Track>;
  pagination: any;
}
export interface getMyTrackPayload {
  params: string;
  filter: GetTrackFilter;
}

export interface getMyTrackResponse {
  records: Array<Track>;
  pagination: any;
}
export interface GetDownloadUrlPayload {
  trackId: string;
}

export interface GetDownloadUrlResponse {
  downloadUrl: string;
}

export interface DeleteTrackPayload {
  trackId: string;
}

export interface DeleteTrackResponse {
  track: Track;
}

export interface TrackUpdatePayload {
  trackId: string;
  dataUpdate: object;
}
export interface TrackUpdateResponse {
  track: Track;
}

export interface TrackDetailsPayload {
  slug: string;
}

export interface TrackDetailsResponse {
  data: Track;
}
export interface BuyManyTrackPayload {
  idTracks: Array<string>;
}

export interface BuyManyTrackResponse {
  payerBalance: {
    remainingTokens: number;
    remainingStars: number;
  };
  tracks: Array<Track>;
}
export interface TrackCreatePayload {
  artwork: string;
  user: object;
  createdAt: string;
  title: string;
  type: string;
  artist: string;
  genres: Array<object>;
  tags: Array<object>;
  bpmStart: number;
  bpmEnd: number;
  trackKey: TrackKey;
  year: number;
  duration: number;
  price: number;
  boughtBy: Array<string>;
  isMyTrack: boolean;
  boughtByMe: boolean;
  isClean: boolean;
  enabled: boolean;
  previewUrl: string;
}
export interface TrackCreateResponse {
  success: boolean;
}

export interface FileFromUrlS3Response {
  blob: string;
}
