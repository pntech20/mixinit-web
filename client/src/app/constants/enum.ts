export enum SIDEBAR_NAVIGATION {
  DRAWER = 'drawer',
  SIDEBAR = 'sidebar',
}

export enum INDIVIDUAL_PAGE {
  LABEL = 'label',
  CONTRIBUTOR = 'contributor',
}

export enum DOWNLOAD_TYPE {
  LOCAL = 'local',
  DROPBOX = 'dropbox',
}

export enum SORT_TYPE {
  CREATED_AT_DESC = 'createdAt@desc',
  INDEX_ASC = 'sortIndex@asc',
  CREATED_AT_PURCHASE_DESC = 'createdAtPurchase@desc',
  CREATED_AT_PURCHASE_ASC = 'createdAtPurchase@asc',
  PUBLISHED_AT_DESC = 'publishDate@desc',
  PUBLISHED_AT_ASC = 'publishDate@asc',
  CREATED_AT_ASC = 'createdAt@asc',
  TOTAL_LIKES_DESC = 'favoritedCount@desc',
  TOTAL_BUYS_DESC = 'totalBuys@desc',
  USERNAME_DESC = 'username@desc',
  USERNAME_ASC = 'username@asc',
  NAME_DESC = 'name@desc',
  NAME_ASC = 'name@asc',
  ORDER_ASC = 'order@asc',
  PRICE_DESC = 'price@desc',
  PRICE_ASC = 'price@asc',
  YEAR_DESC = 'year@desc',
  YEAR_ASC = 'year@asc',
  DURATION_DESC = 'duration@desc',
  DURATION_ASC = 'duration@asc',
  BPM_DESC = 'bpmStart@desc',
  BPM_ASC = 'bpmStart@asc',
  CAMELOT_KEY_DESC = 'camelotKey@desc',
  CAMELOT_KEY_ASC = 'camelotKey@asc',
  MUSIC_KEY_DESC = 'musicKey@desc',
  MUSIC_KEY_ASC = 'musicKey@asc',
  TITLE_DESC = 'title@desc',
  TITLE_ASC = 'title@asc',
  TRACK_ASC = 'track@asc',
  TRACK_DESC = 'track@desc',
  TOP_MOVERS = 'totalDownloads@desc',
  TOP_MOVERS_7 = '7',
  TOP_MOVERS_30 = '30',
  TOP_MOVERS_90 = '90',
  TOP_MOVERS_ALL = 'all',
  LAST_UPDATED_DESC = 'createdAt@desc',
  NEW_RELEASES_DESC = 'newReleases@desc',
  TOTAL_TRACKS_DESC = 'totalTracks@desc',
  LATEST_UPLOADED_DESC = 'lastUploadTrack@desc',
  TOTAL_RELEASES_DESC = 'totalReleases@desc',
  TOTAL_PLAYLISTS_DESC = 'totalPlaylists',
  BLOCKED_USER = 'blockedUser',
  SHOW_SECTIONS = 'showSections',
  SHOW_GENRES = 'showGenres',
  SHOW_SUB_GENRES = 'showSubGenres',
  SHOW_TRACKKEYS = 'showTrackKeys',
  SHOW_CONTRIBUTORS = 'showContributors',
  SHOW_TAGS = 'showTags',
  TOP_MOVERS_USER = 'totalBuy@desc',
  Most_Popular = 'mostPopular',
}

export enum DATE_RANGE {
  ALL_TIME = 'all',
  LAST_7_DAYS = 7,
  LAST_30_DAYS = 30,
  LAST_90_DAYS = 90,
  LAST_60_DAYS = 60,
}

export enum ARRANGEMENT_POSITION {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

export enum REPLY_TYPE {
  NO_MEDIA = 'NO_MEDIA',
  FREE_MEDIA = 'FREE_MEDIA',
  PAID_MEDIA = 'PAID_MEDIA',
}

export enum SERVICES_TYPE {
  SUBSCRIPTION_TIERS = 'tiers',
  TOKEN_PLANS = 'tokens',
  STORAGE_PLANS = 'storages',
}

export enum MEDIA_TYPE {
  SHOWAUIDO = 'showAudio',
  SHOWVIDEO = 'showVideo',
  CHECKBOX = 'checkbox',
}
export enum IMG_OF_USER {
  AVATAR = 'avatar',
  COVER_IMAGE = 'cover',
  PROMOSHOT_IMAGE = 'promoshot',
}
export enum MODEL_PATH_OF_S3 {
  RELEASES = 'releases',
  TRACKS = 'tracks',
  PLAYLISTS = 'playlists',
  USERS = 'users',
  ADS = 'ads',
  POSTS = 'posts',
  COMMENTS = 'comments',
}
export enum MODE_OF_POST {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum CRATE_VALUE_TYPE {
  TEXT = 'text',
  DATE = 'date',
  NUMBER = 'number',
  RELATION = 'relation',
  USER = 'user',
  GENRES = 'genres',
  TAGS = 'tags',
  KEY = 'key',
}

export enum TYPE_OF_INPUT {
  SELECT = 'select',
  TEXTAREA = 'textarea',
  COUNTRY = 'country',
  INPUT = 'input',
}

export enum PLAYLISTS_STATUS {
  PUBLISH = 'publish',
  PRIVATE = 'private',
  INACTIVE = 'inactive',
}

export enum BANNER_PAGE {
  TRACKS = 'tracks',
  TIMELINE = 'timeline',
  MYTRACKS = 'mytracks',
  MYRELEASES = 'myreleases',
  MYPLAYLISTS = 'myplaylists',
  MYLIKES = 'mylikes',
  UPLOADER = 'uploader',
  SERVICES = 'services',
  SERVICES_TOKENS = 'servicesTokens',
  SERVICES_SUBS = 'servicesSubs',
  SERVICES_AVSLOTS = 'servicesAVSlots',
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum MY_MEDIA_TYPE {
  MY_TRACKS = 0,
  MY_RELEASES = 1,
  MY_PLAYLISTS = 2,
}

export enum LABEL_DETAIL_TYPE {
  ABOUT = 0,
  TRACKS = 1,
  RELEASES = 2,
  // PLAYLISTS = 3,
  CONTRIBUTORS = 3,
}

export enum PROFILE_TYPE {
  // ABOUT = 0,
  TRACKS = 0,
  RELEASES = 1,
  LABELS = 2,
}

export enum MY_LIKES_TYPE {
  LIKED_TRACKS = 0,
  LIKED_RELEASES = 1,
  LIKED_PLAYLISTS = 2,
}

export enum TRACK_TYPE {
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum NAME_SLIDER {
  NUMBER_TRACKS = 'numberTracks',
  RELEASE_YEAR = 'releaseYear',
  RELEASE_TOKENS = 'releaseTokens',
}

export enum PLAYLIST_TYPE {
  VIDEO = 'video',
  IMAGE = 'image',
}

export enum IMAGE_TYPE {
  JPG = 'jpg',
  GIF = 'gif',
  BMP = 'bmp',
  PNG = 'png',
}

export enum BITRATE_MP3 {
  KBPS320 = 320,
  KBPS128 = 128,
}

export enum INPUT_TYPE {
  TEXT_AREA = 'textarea',
  CHECK_BOX = 'checkbox',
}

export enum PRESS_KEY_TYPE {
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
}

export enum SLIDER_TYPE {
  BPM_FROM = 'bpmFrom',
  BPM_TO = 'bpmTo',
  BPM = 'bpm',
  PRICE_FROM = 'priceFrom',
  PRICE_TO = 'priceTo',
  PRICE = 'price',
  YEAR_FROM = 'yearFrom',
  YEAR_TO = 'yearTo',
  YEAR = 'year',
  DROPDOWN = 'dropdown',
  NUMBER_TRACKS_FROM = 'numberTracksFrom',
  NUMBER_TRACKS_TO = 'numberTracksTo',
  NUMBER_TRACKS = 'Number Tracks',
  RELEASE_YEAR_FROM = 'releaseYearFrom',
  RELEASE_YEAR_TO = 'releaseYearTo',
  RELEASE_YEAR = 'Release Year',
  RELEASE_TOKEN_FROM = 'releaseTokensFrom',
  RELEASE_TOKEN_TO = 'releaseTokensTo',
  RELEASE_TOKEN = 'Release Tokens',
}

export enum ENUM_TYPE_REQUEST {
  DOWNLOAD = 'download',
  LABEL = 'label',
}

export enum ACCOUNTING_TABS {
  OVERVIEW = 'overview',
  LABELS = 'labels',
  TRACKS = 'tracks',
  RELEASES = 'releases',
  SUBSCRIPTIONS = 'subscriptions',
}

export enum TRACK_DETAIL_TABS {
  TRACK_DETAILS = 'trackDetail',
  RELATED_TRACK = 'relatedTrack',
  RELEASE = 'release',
  PLAYLIST = 'playlist',
}

export enum MY_LIBRARY_TABS {
  CASH_PURCHASE = 'cash-purchase',
  STAR_PURCHASE = 'star-purchase',
  SUBSCRIPTION_PURCHASE = 'subscription-purchase',
  ALL_PURCHASE = 'all-purchase',
}

export enum PACKAGE_TABS {
  TOKENS = 'tokens',
  SUBSCRIPTIONS = 'subscription',
}

export enum OPTION_DISCOUNT {
  DISCOUNT10 = '10% OFF',
  DISCOUNT15 = '15% OFF',
  DISCOUNT20 = '20% OFF',
  DISCOUNT25 = '25% OFF',
  DISCOUNT30 = '30% OFF',
  DISCOUNT35 = '35% OFF',
  DISCOUNT40 = '40% OFF',
  DISCOUNT45 = '45% OFF',
  DISCOUNT50 = '50% OFF',
  DISCOUNT55 = '55% OFF',
  DISCOUNT60 = '60% OFF',
  DISCOUNT65 = '65% OFF',
  DISCOUNT70 = '70% OFF',
  DISCOUNT75 = '75% OFF',
  NUMBER10 = '10',
  NUMBER15 = '15',
  NUMBER20 = '20',
  NUMBER25 = '25',
  NUMBER30 = '30',
  NUMBER35 = '35',
  NUMBER40 = '40',
  NUMBER45 = '45',
  NUMBER50 = '50',
  NUMBER55 = '55',
  NUMBER60 = '60',
  NUMBER65 = '65',
  NUMBER70 = '70',
  NUMBER75 = '75',
}

export enum TIME_FRAMES {
  CURRENT_MONTH = 'currentMonth',
  LAST_MONTH = 'lastMonth',
  ALL_TIME = 'allTime',
}

export enum SIDEBAR {
  DROPDOWN_LINK = 'DropdownLink',
  SAVED = 'saved',
  ALL_TIME = 'allTime',
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list',
}

export enum TYPE_FILTER {
  TYPE_QUERY_FILTER = 'typeFilter',
  ALL = 'all',
  EACH = 'each',
}

export enum TYPE_SEARCH_OPTION {
  TRACKS = 'tracks',
  RELEASES = 'multipacks',
  CONTRIBUTORS = 'contributors',
  PLAYLISTS = 'playlists',
  LABELS = 'labels',
}

export enum WEBHOOK_EVENT {
  CHECKOUT_CART = 'checkoutCart',
  BUY_PLAYLIST = 'buyPlaylist',
}

export enum SLACK_CHANNELS {
  SUBSCRIPTIONS = 'C07MBFZPFNC',
  SALES = 'C07LG3NDZ9C',
  ERRORS = 'C07LR781BT6',
  ONBOARDING = 'C07L85PJYK1',
  LOGS_TESTING = 'C07M1H0BEP3',
  TIME_EXECUTE = 'C07MJPTUL78',
  SUPPORT = 'C07NHQD74GL',
  S3 = 'C07NMFF8RV2',
  DOWNLOADS = 'C07PKU61HFE',
  UPLOADER = 'C07P9NV6SJV',
  PAYPAL = 'C07P92ASKCM',
}
