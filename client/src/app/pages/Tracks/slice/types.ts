import { IOption } from 'app/constants/interface';
import { Nullable } from 'app/constants/types';
import { IPagination, Track } from 'app/models';

/* --- STATE --- */
export interface TrackState {
  featuredTracks: any;
  tracksByCreateAt: any;
  tracks: any;
  myTracks: any;
  myDraftTracks: any;
  myTracksPurchased: any;
  isLoading: boolean;
  error: Nullable<Error | string>;
  pagination: null | IPagination;
  trackUrl: string;
  isLoadingFeaturedTrack: boolean;
  isDownloadSuccess: boolean;
  trackIdDownloaded: string;
  isLoadingCreateAt: boolean;
  top10Tracks: any;
  isLoadingTop10Track: boolean;
  listTracks: any;
  totalPage: number;
  currentPage: number;
  resultsPerPage: number;
  topTracks: Array<Track>;
  listTracksUploadedSuccess: Array<object>;
  isLoadingMore: boolean;
  isShowFilter: boolean;
  tokenMax: number;
  tokenMin: number;
  filterTrack: any;
  isLoadingDownloadZip: boolean;
  isLoadingBuyTrack: boolean;
  isCheckOpenModelBuySubscription: boolean;
  myTracksStarPurchased: any;
  isLoadingDraftTracks: boolean;
  myAllTracksPurchased: any;
  myTracksSubscriptionPurchased: any;
  searchValue: string;
  isLoadingTrackMyLibrary: boolean;
  isDownloadingTrack: boolean;
  isSavingDropboxTrack: boolean;
  isUpdatingTrack: boolean;
  isUpdatingTrackSuccess: boolean;
  tabMyLibrary: string;
  buyTrackBySubSuccess?: boolean;
  trackIdBuyBySub?: any;
  isDownloadTrackSuccess?: boolean;
  isFilterGlobalPageHome?: boolean;
  btnFilters?: any;
  checkHideAndHiddenMyTrack?: boolean;
  trackIdFavoritedAction?: string;
  checkFavoritedAction?: boolean;
  showFavoriteByMe?: boolean;
}
export interface TracksResponse {
  data: Array<Track>;
  currentPage: number;
  perPage: number;
  totalData: number;
  totalPage: number;
}

export interface TracksPayload {
  params: string;
  filter: any;
}

export interface TrackUpdatePayload {
  trackId: string;
  dataUpdate: object;
}

export interface TopTracksPayload {
  selectedTime: number;
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
  numberDownloads?: number;
  boughtByMe: boolean;
  url: string;
}

export interface GetDownloadUrlResponse {
  trackUrl: string;
}

export interface TrackCreatePayload {
  artwork: string;
  title: string;
  artist: string;
  genre: string;
  tags: Array<object>;
  bpmStart: number;
  bpmEnd: number;
  year: number;
  duration: number;
  price: number;
  boughtBy?: Array<string>;
  isMyTrack?: boolean;
  boughtByMe?: boolean;
  isClean: boolean;
  isEnabled?: boolean;
  url: string;
  previewUrl: string;
  subGenre: string;
  subGenre2: string;
  trackKey?: string;
  hasSamples: boolean;
  isOriginal: boolean;
  samples: Array<string>;
  totalSlots: number;
  isWav: boolean;
  label: string;
  type: string;
}

export interface TrackCreateResponse {
  success: boolean;
}

export interface TracksFilter {
  showAudio?: boolean;
  showVideo?: boolean;
  dateRange?: string;
  sort?: string;
  showTags?: IOption[];
  showGenres?: IOption;
  showTrackKeys?: IOption;
  showSections?: IOption;
  search?: string;
  page?: number;
  pageSize?: number;
  showContributors?: IOption;
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

export interface TracksFilters {
  showAudio?: boolean;
  showVideo?: boolean;
  dateRange?: any;
  sort?: any;
  showTags?: any;
  showGenres?: any;
  showTrackKeys?: any;
  showSections?: any;
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
