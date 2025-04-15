import { REPLY_TYPE } from 'app/constants/enum';
import { OptionsFiltersProps } from 'app/constants/interface';
export interface User {
  _id: string;
  blocked: boolean;
  instantCashout: boolean;
  storageRemaining: number;
  isTeamFavorite: boolean;
  tokensRemaining: number;
  starsRemaining: number;
  isAdmin: boolean;
  cashoutBlocked: boolean;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  createdAt: string;
  lastUploadTrack: string;
  updatedAt: string;
  tier: string;
  storage: string;
  socialURLs: object;
  follow: Array<any>;
  totalFollowers: number;
  totalFollowings: number;
  biography: string;
  address: string;
  city: string;
  country: string;
  postalCode: number;
  avatar: string;
  cover: string;
  promoShot: string;
  genres: Array<any>;
  tags: Array<any>;
  labels: Array<any>;
  totalReleases: number;
  totalPlaylists: number;
  totalLabels: number;
  isFeatured: boolean;
  totalTracks: number;
  totalPosts: number;
  specialSections: Array<any>;
  releases: Array<Release>;
  tracks: Array<Track>;
  playlists: Array<Playlist>;
  followedByMe?: boolean;
  followedBy?: Array<any>;
  mobileNumber: string;
  gender?: string;
  slotsRemaining: number;
  blockedByMe: boolean;
  purchasedTokensRemaining: number;
  twitterUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  mixcloudUrl?: string;
  facebookUrl?: string;
  spotifyUrl?: string;
  slug?: string;
  showTrackPurchases?: boolean;
  showMyOwnTracks?: boolean;
  canUploadToLabels?: any;
  blockedSubscription?: boolean;
  totalTracksOrReleasesEachLabel?: any;
  lastUploadEachLabel?: any;
}

export interface Wishlist {
  _id?: string;
  user?: SimplifiedUser;
  createdAt?: string;
  track?: Track;
  release?: Release;
  type?: string;
}

export interface General {
  scrollValue?: number;
}
export interface Track {
  _id: string;
  id: string;
  slug: string;
  artwork: string;
  user: SimplifiedUser;
  createdAt: string;
  publishDate?: string;
  title: string;
  type: string;
  artist: string;
  genre: Genre;
  subGenre: Genre;
  subGenre2?: Genre;
  tags: Array<Tag>;
  bpmStart: number;
  bpmEnd: number;
  trackKey: TrackKey;
  year: number;
  duration: number;
  price: number;
  boughtBy: Array<string>;
  isMyTrack: boolean;
  boughtByMe: boolean;
  isWav: boolean;
  isClean: boolean;
  enabled: boolean;
  previewUrl: string;
  hasSamples?: boolean;
  isOriginal?: boolean;
  samples?: Array<Sample>;
  section: Section;
  releases?: Array<Release>;
  genres: Array<any>;
  relatedTracks?: Array<Track>;
  description?: string;
  background?: string;
  totalSlots?: number;
  totalBuys?: number;
  isFeatured?: boolean;
  releaseOnly?: boolean;
  albumCover?: any;
  key: string;
  isPlaying?: boolean;
  label: Section;
  isBelongMyWishlist?: boolean;
  numberDownloads?: number;
  numberPurchases?: number;
  numberReleases?: number;
  disabledByUser?: boolean;
  favoriteByMe?: boolean;
  previewStartAt?: number;
  previewEndAt?: number;
  favoritedBy?: any;
}
export interface SimplifiedUser {
  _id: string;
  username: string;
  avatar?: string;
  firstName?: string;
  role?: string;
  lastName?: String;
  followedByMe?: boolean;
  biography?: string;
  slug?: string;
}
export interface Genre {
  description: string;
  bgColor: string;
  color: string;
  createdAt: string;
  _id: string;
  name: string;
  numOfTracks: number;
  slug: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  color: string;
  bgColor: string;
  isFromAdmin: boolean;
  user?: SimplifiedUser;
  isMyTag?: boolean;
  numOfTracks: number;
}
export interface TrackKey {
  _id: string;
  musicKey: string;
  camelotKey: string;
  createdAt: string;
}
export interface Sample {
  _id: string;
  source: string;
  track: string;
  originalTrackUrl: string;
}
export interface Section {
  color: string;
  artwork: any;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  createdAt: string;
  lastUploadTrack?: string;
  _id: string;
  slug?: string;
  contributors?: Array<User>;
  genres: Array<Genre>;
  tags: Array<Tag>;
  isActive?: boolean;
  biography?: string;
  percentageOfTokensCanKeep?: number;
  defaultTrackPrice?: number;
  squareImageUrl?: string;
  tracks: Array<Track>;
  contributorPricing?: boolean;
  percentageOfReleaseDiscount?: number;
  bannerImageUrl?: string;
  numberTracks?: number;
  numberContributors?: number;
  numberReleases?: number;
  numberPlaylists?: number;
  numberReleasesOfContributor?: number;
  numberTracksOfContributor?: number;
}
export interface Release {
  retailPrice: number;
  savePrice: number;
  _id: string;
  slug: string;
  artwork: string;
  user: SimplifiedUser;
  createdAt: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  tracks: Array<Track>;
  trackByRelease: number;
  boughtBy: Array<string>;
  isMyRelease: boolean;
  boughtByMe: boolean;
  enabled: boolean;
  genres: Array<Genre>;
  tags: Array<Tag>;
  label?: Section;
  isFeatured?: boolean;
  isBelongMyWishlist?: boolean;
  totalBuys?: number;
  status?: string;
  maxNumTracks: number;
  totalTracks?: number;
  totalUnBuyTracks?: number;
  originalPrice?: number;
  priceByUser?: number;
  userId?: string;
  isBuyAllTrackOfRelease?: boolean;
}
export interface IPagination {
  total?: number;
  limit: number;
  start?: number;
  currentPage: number;
  totalPages?: number;
}
export interface Post {
  _id: string;
  user: SimplifiedUser;
  createdAt: string;
  content: string;
  replyType?: REPLY_TYPE;
  tracks: Array<Track>;
  isPublic: boolean;
  allowADS: boolean;
  tokensCostPerADS?: number;
  limitMedia?: number;
  originalPost?: Post;
  sharedPosts?: Array<string>;
  isMyPost: boolean;
  totalShares: number;
  totalComments: number;
  comments?: Array<Comment>;
  photos: Array<string>;
}
export interface Subscription {
  percentageOfTokensCanKeep: number;
  name: string;
  avSlots: number;
  price: number;
  active: boolean;
  listItem: string[];
  description: string;
}

export interface ReleasesFilter {
  showAudio?: boolean;
  showVideo?: boolean;
  dateRange?: string | number;
  sort?: string;
  showTags?: OptionsFiltersProps[];
  showGenres?: OptionsFiltersProps[];
  showTrackKeys?: OptionsFiltersProps[];
  showSections?: OptionsFiltersProps[];
  showContributors?: OptionsFiltersProps[];
  featuredOnly?: boolean;
  userId?: string;
  username?: any;
  clean?: boolean;
  dirty?: boolean;
  showPurchasesOnly?: boolean;
  numberTracksFrom: number;
  numberTracksTo: number;
  releaseYearFrom: number;
  releaseYearTo: number;
  releaseTokensFrom: number;
  releaseTokensTo: number;
}

export interface Crate {
  _id: string;
  name: string;
  user: SimplifiedUser;
  rules: object;
  color: string;
  type: string;
  isMyCrate: boolean;
  createdAt: string;
  role?: string;
}

export interface Playlist {
  slug: string;
  _id: string;
  artwork: string;
  user?: SimplifiedUser | undefined;
  createdAt: string;
  title: string;
  tracks: Array<Track>;
  boughtBy?: Array<string>;
  boughtByMe?: boolean;
  totalFollowers: string;
  followedByMe: boolean;
  genres: Array<Genre>;
  tags: Array<Tag>;
  isFeatured?: boolean;
  description: string;
  updatedAt: string;
  totalTracks?: number;
  status?: string;
  collaborators: any;
  isMyPlaylist?: boolean;
  artworkUrl?: string;
  totalPriceWithDiscount?: number;
  userId?: string;
  label?: Section;
  totalUnBuyTracks?: number;
  price: number;
}
export interface Users {
  username: string;
  avatar: string;
  followedByMe?: boolean;
}

export interface GetPostByIdResponse {
  post: Post;
}

export interface GetPostByIdPayload {
  postId: string;
}
export interface Transaction {
  _id: string;
  createdAt: string;
  type: string;
  currency: string;
  amount: number;
  displayType: string;
  isIncome: boolean;
  item: string;
  country: String;
}
export interface Storage {
  _id: string;
  name: string;
  paypalPlan: string;
  price: number;
  numOfSlots: number;
  createdAt: string;
  isCurrentStorage: boolean;
  active: boolean;
}

export interface Reply {
  _id: string;
  comment: string;
  user: SimplifiedUser;
  createdAt: string;
  content: string;
  isMyReply: boolean;
  photos: Array<string>;
}

export interface Comment {
  _id: string;
  post: string;
  user: SimplifiedUser;
  createdAt: string;
  content: string;
  tracks: Array<Track>;
  replies: Array<Reply>;
  isMyComment: boolean;
  photos: Array<string>;
}

export interface PlaylistsFilter {
  ourPlaylists?: any;
  userPlaylists?: any;
  showAudio?: any;
  showVideo?: any;
  sort?: any;
  featuredOnly?: boolean;
  showTrackKeys?: any;
  showSections?: any;
  dateRange?: any;
  showTags?: any;
  showGenres?: any;
  userId?: string;
  username?: any;
  showContributors?: any;
  clean?: boolean;
  dirty?: boolean;
  showPurchases?: boolean;
  showPurchasesOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface UsernameFilter {
  sort: string;
  page?: number;
  pageSize?: number;
  search?: any;
  labelId?: string;
}

export interface TrackUpdate {
  artwork: string;
  title: string;
  artist: string;
  genre: any;
  tags: Array<any>;
  bpmStart: number;
  bpmEnd: number;
  year: number;
  isClean: boolean;
  hasSamples?: boolean;
  isOriginal?: boolean;
  releaseOnly: boolean;
  enabled: boolean;
  subGenre: any;
  subGenre2: any;
  samples: Array<any>;
  previewUrl: string;
  key: string;
  label: any;
  price: number;
}

export interface TrackUpdateResponse {
  track: Track;
}

export interface Banner {
  page: string;
  url: string;
}

export interface Pool {
  _id: string;
  totalCash: number;
  totalTokens: number;
  tokenValue: number;
  minCashoutAMT: number;
  cashoutFeePCT: number;
  maxCashoutFee: number;
  createdAt: string;
}

export interface Token {
  _id: string;
  name: string;
  tokens: number;
  price: number;
  maxDownloadsPerMonth?: number;
  recurringDays?: number;
  isRecurring?: boolean;
  labelsIncluded?: Array<Section>;
  planId?: string;
  isSubscribe?: boolean;
}

export interface SubcriptionTier {
  _id: string;
  avSlots: number;
  sections: Array<Section>;
  name: string;
  price: number;
  percentageOfTokensCanKeep: number;
  multicastDestinations: number;
  createdAt: Date;
  isCurrentTier: boolean;
  paypalPlan: string;
  active: boolean;
  description: string;
  cashOutPerMonth: number;
  isDefault: boolean;
  allowCreateSection?: boolean;
}

export interface Storage {
  _id: string;
  name: string;
  paypalPlan: string;
  price: number;
  numOfSlots: number;
  createdAt: string;
  isCurrentStorage: boolean;
  active: boolean;
}

export interface Genre {
  bgColor: string;
  color: string;
  createdAt: string;
  _id: string;
  name: string;
  numOfTracks: number;
  slug: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  color: string;
  isFromAdmin: boolean;
  user?: SimplifiedUser;
  isMyTag?: boolean;
  numOfTracks: number;
}

export interface Advertisement {
  banner: string;
  description: string;
}

export interface SimplifiedUser {
  _id: string;
  username: string;
  avatar?: string;
  firstName?: string;
  lastName?: String;
  followedByMe?: boolean;
}

export interface Track {
  _id: string;
  slug: string;
  artwork: string;
  user: SimplifiedUser;
  createdAt: string;
  title: string;
  type: string;
  artist: string;
  genre: Genre;
  subGenre: Genre;
  subGenre2?: Genre;
  tags: Array<Tag>;
  bpmStart: number;
  bpmEnd: number;
  trackKey: TrackKey;
  year: number;
  duration: number;
  price: number;
  boughtBy: Array<string>;
  isMyTrack: boolean;
  boughtByMe: boolean;
  favoriteByMe?: boolean;
  isWav: boolean;
  isClean: boolean;
  enabled: boolean;
  previewUrl: string;
  hasSamples?: boolean;
  isOriginal?: boolean;
  samples?: Array<Sample>;
  section: Section;
  releases?: Array<Release>;
  genres: Array<any>;
  relatedTracks?: Array<Track>;
  description?: string;
  background?: string;
  totalSlots?: number;
  totalBuys?: number;
  isFeatured?: boolean;
  releaseOnly?: boolean;
  albumCover?: any;
  key: string;
  isPlaying?: boolean;
  label: Section;
  labelsIncluded?: string;
}

export interface Sample {
  _id: string;
  source: string;
  track: string;
  originalTrackUrl: string;
}
export interface Sample {
  _id: string;
  source: string;
  track: string;
  originalTrackUrl: string;
}

export interface Release {
  _id: string;
  slug: string;
  artwork: string;
  user: SimplifiedUser;
  createdAt: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  tracks: Array<Track>;
  boughtBy: Array<string>;
  isMyRelease: boolean;
  boughtByMe: boolean;
  enabled: boolean;
  genres: Array<Genre>;
  tags: Array<Tag>;
  isFeatured?: boolean;
  totalBuys?: number;
  status?: string;
  discountPCT: number;
  saveTokens?: number;
  totalTracks?: number;
  totalUnBuyTracks?: number;
  originalPrice?: number;
  priceByUser?: number;
}

export interface TrackKey {
  _id: string;
  musicKey: string;
  camelotKey: string;
  createdAt: string;
}

export interface Banner {
  page: string;
  url: string;
}
