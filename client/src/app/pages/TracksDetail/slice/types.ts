import { Nullable } from 'app/constants/types';
import { Release, Track } from 'app/models';
import { Rule } from 'app/pages/PageCrate/slice/types';

/* --- STATE --- */
export interface TrackDetailState {
  trackInfo: any;
  relatedTracks: any;
  releases: any;
  isLoading: boolean;
  error: Nullable<Error | string>;
}

export interface TracksFilter {
  showAudio?: boolean;
  showVideo?: boolean;
  dateRange?: any;
  sort?: any;
  showTags?: any;
  showGenres?: any;
  showTrackKeys?: any;
  showSections?: any;
  rules?: Array<Rule>;
  search?: string;
  page?: number;
  pageSize?: number;
  showContributors?: { value: string };
  clean?: boolean;
  dirty?: boolean;
  userId?: string;
  bpmFrom: number;
  bpmTo: number;
  yearFrom: number;
  yearTo: number;
  priceFrom: number;
  priceTo: number;
}
export interface TrackDetailPayload {
  slug: string;
}

export interface TrackDetailResponse {
  trackInfo: Track;
  relatedTracks: Track[];
  releases: Release[];
}

export interface RelatedTrackDetailResponse {
  relatedTracks: Track[];
}

export interface ReleasesTrackDetailResponse {
  releases: Release[];
}

export interface BuyTrackPayload {
  trackId: string;
  type?: string;
}

export interface BuyTrackResponse {
  payerBalance: {
    remainingTokens: number;
    remainingStars: number;
  };
  downloadUrl: string;
  _id: string;
  typeTrack: string;
  boughtByMe: boolean;
}
