export const IP_ADDRESS = 'ipAddress';
export const COUNTRY = 'country';
export const ACCESS_TOKEN = 'accessToken';
export const REDIRECT_URL = 'redirectUrl';
export const IS_REDIRECT_URL = 'isRedirectUrl';
export const REFRESH_TOKEN = 'refreshToken';
export const AUTHORIZATION = 'Authorization';
export const ROW_PER_PAGE_OPTIONS = [10, 25, 50];
export const TRACK = 'track';
export const ARTIST = 'artist';
export const MP4_FILE = 'mp4';
export const MP3_FILE = 'mp3';
export const WAV_FILE = 'wav';
export const VIDEO_TYPE = 'video/mp4';
export const VIDEO_TYPE_UPLOAD = 'video/*';
export const AUDIO_TYPE_UPLOAD = '.mp3';
export const IMAGE_TYPE = 'image';
export const AUDIO_TYPE = 'audio/mpeg';
export const WAV_TYPE = 'audio/wav';
export const MP3_320KBPS_FILE = 'MP3 320KBPS';
export const MP4 = 'MP4';
export const AUDIO = 'audio';
export const VIDEO = 'video';
export const SIZE_FILE_BY_SLOT = 250;
export const BPM_MIN = 0;
export const BPM_MAX = 220;
export const TOKEN_MIN = 0;
export const TOKEN_MAX = 50;
export const YEAR_MIN = 1950;
export const NUMBER_PURCHASE_MIN = 0;
export const NUMBER_PURCHASE_MAX = 500;
export const TOKEN_VALUE = 0.01;
export const SIZE_FILE_TO_MB = 1000000;
export const VALUE_SHOW_LIKES = 'Show Likes';
export const ACCESS_TOKEN_SOCIAL = 'access_token=';
export const ID_TOKEN_SOCIAL = 'id_token=';
export const PHONE_REGEX =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const MENTION_USER = 'mentionUser:';

export const DEFAULT_PAGE_SIZE = localStorage.getItem('resultsPerPage')
  ? +(localStorage.getItem('resultsPerPage') || '')
  : 20;

export const VALIDATE_PASSWORD = /^[A-Za-z\d#$@!%&*?]{8,}$/;
export const COLOR_TAG = '#0055D6';
export const COLOR_TAGS = '#ffffff';
export const COLOR_GENRE = '#242424';
export const COLOR_GENRES = '#ffffff';
export const BG_COLOR_TAG = '#0055D6';
export const BG_COLOR_TAGS = '#9b0000';
export const BG_COLOR_GENRE = '#FFFFFF';
export const BG_COLOR_GENRES = '#0066D3';
export const MAX_WIDTH_SCREEN = 1440;
export const OTHERS_FOLDER_UPLOAD_S3 = 'others';
