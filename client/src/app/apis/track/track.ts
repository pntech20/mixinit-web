import { COUNTRY, IP_ADDRESS } from 'app/constants';
import { Nullable, Undefinedable } from 'app/constants/types';
import { getLocalStorage } from 'app/helpers/local-storage';
import {
  BuyTrackPayload,
  BuyTrackResponse,
} from 'app/pages/Tracks/slice/types';
import {
  TrackDetailPayload,
  TrackDetailResponse,
} from 'app/pages/TracksDetail/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';
import {
  BuyManyTrackPayload,
  BuyManyTrackResponse,
  DeleteTrackPayload,
  DeleteTrackResponse,
  FileFromUrlS3Response,
  GetDownloadUrlPayload,
  GetDownloadUrlResponse,
  TrackCreatePayload,
  TrackCreateResponse,
  TrackDetailsPayload,
  TrackDetailsResponse,
  TracksPayload,
  TracksResponse,
  TrackUpdatePayload,
  TrackUpdateResponse,
  TrackUploadPayload,
  TrackUploadResponse,
  TopTracksResponse,
} from './type';

const TRACK_BASE_URL = '/v1/tracks';
const USER_BASE_URL = '/v1/user';
const FILE_BASE_URL = '/v1/files';
const STAR_PURCHASES_BASE_URL = '/v1/star-purchases';
const SUBSCRIPTION_PURCHASES_BASE_URL = '/v1/contributor-subscription-purchase';

export const getTrack = async (
  payload: TracksPayload,
): Promise<Nullable<TracksResponse>> => {
  const queryParams = payload?.params || '';
  const filter = payload?.filter || {};
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/search?${queryParams}`,
    filter,
  );
  return response?.data.data;
};

export const getTopTrack = async (payload: {
  selectedTime: number;
}): Promise<Nullable<TopTracksResponse>> => {
  const response = await axiosService.post(`${TRACK_BASE_URL}/top`, payload);
  return response?.data.data;
};

export const getAllTracks = async (
  payload: null,
): Promise<Nullable<TracksResponse>> => {
  const response = await axiosService.get(TRACK_BASE_URL);
  return response?.data.data;
};

export const getTrackDetail = async (
  payload: TrackDetailPayload,
): Promise<Nullable<TrackDetailResponse>> => {
  const trackSlug = payload?.slug;
  const response = await axiosService.get(
    `${TRACK_BASE_URL}/slug/${trackSlug}`,
  );

  return response?.data.data;
};

const searchTracks = async (
  payload: TracksPayload,
): Promise<TracksResponse | undefined> => {
  const queryParams = payload?.params || '';

  const filter = payload?.filter || {};
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/search?${queryParams}`,
    filter,
  );

  return path<TracksResponse>(['data', 'data'], response);
};

const getTracksPurchased = async (
  payload: TrackUploadPayload,
): Promise<TrackUploadResponse | undefined> => {
  const queryParams = payload?.params || '';
  const filter = payload?.filter || {};
  const response = await axiosService.post(
    `${USER_BASE_URL}/get-tracks-purchased?${queryParams}`,
    filter,
  );
  return path<TrackUploadResponse>(['data', 'data'], response);
};

const getFullUrlTrack = async (
  payload: GetDownloadUrlPayload,
): Promise<Undefinedable<GetDownloadUrlResponse>> => {
  const response = await axiosService.get(
    `${TRACK_BASE_URL}/${payload.trackId}/full-url`,
  );

  return path<GetDownloadUrlResponse>(['data', 'data'], response);
};

const downloadFromMultipleUrls = async (
  payload: any,
): Promise<Undefinedable<GetDownloadUrlResponse>> => {
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/downloads`,
    payload.trackIds,
  );

  return path<GetDownloadUrlResponse>(['data', 'data'], response);
};

const buyTrackBySubscriptionApi = async (payload: { trackId: string }) => {
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/${payload.trackId}/buy-by-subscription`,
    {
      ipAddress: getLocalStorage(IP_ADDRESS),
      country: getLocalStorage(COUNTRY),
    },
  );

  return path<GetDownloadUrlResponse>(['data', 'data'], response);
};

const deleteTrack = async (
  payload: DeleteTrackPayload,
): Promise<Undefinedable<DeleteTrackResponse>> => {
  const response = await axiosService.delete(
    `${TRACK_BASE_URL}/${payload.trackId}`,
  );

  return path<DeleteTrackResponse>(['data', 'data'], response);
};

const deleteDraftTrack = async (
  payload: DeleteTrackPayload,
): Promise<Undefinedable<any>> => {
  const response = await axiosService.delete(
    `${TRACK_BASE_URL}/draft/${payload.trackId}`,
  );

  return path<DeleteTrackResponse>(['data', 'data'], response);
};

const updateTrack = async (
  payload: TrackUpdatePayload,
): Promise<Nullable<TrackUpdateResponse>> => {
  const response = await axiosService.put(
    `${TRACK_BASE_URL}/${payload.trackId}`,
    payload.dataUpdate,
  );

  return response?.data;
};

const updateDraftTrack = async (
  payload: any,
): Promise<Nullable<TrackUpdateResponse>> => {
  const response = await axiosService.put(
    `${TRACK_BASE_URL}/draft/${payload.trackId}`,
    payload.formData,
  );

  return response?.data;
};

const publishTracks = async (
  payload: any,
): Promise<Nullable<TrackUpdateResponse>> => {
  const response = await axiosService.put(
    `${TRACK_BASE_URL}/publishTracks`,
    payload,
  );

  return response?.data;
};

const updateSampleOfTrack = async (
  payload: any,
): Promise<Nullable<TrackUpdateResponse>> => {
  const response = await axiosService.put(
    `${TRACK_BASE_URL}/draft/sample/${payload.trackId}`,
    payload.dataUpdate,
  );

  return response?.data;
};

const updateNumberDownloadTrack = async (
  payload: any,
): Promise<Nullable<TrackUpdateResponse>> => {
  const response = await axiosService.put(
    `${TRACK_BASE_URL}/number-download/${payload.trackId}`,
  );

  return response?.data;
};

const getTrackDetails = async (
  payload: TrackDetailsPayload,
): Promise<TrackDetailsResponse | undefined> => {
  const slug = encodeURIComponent(payload?.slug);
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/trackInfo/${slug}`,
    { slug: decodeURIComponent(slug) },
  );

  return path<TrackDetailsResponse>(['data', 'data'], response);
};

const getRelatedTracksDetails = async (
  payload: any,
): Promise<TrackDetailsResponse | undefined> => {
  const slug = encodeURIComponent(payload?.slug);
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/relatedTracks/${slug}`,
    {
      ...payload?.data,
      slug: decodeURIComponent(slug),
    },
  );

  return path<TrackDetailsResponse>(['data', 'data'], response);
};

const getReleasesTrackDetails = async (
  payload: TrackDetailsPayload,
): Promise<TrackDetailsResponse | undefined> => {
  const slug = encodeURIComponent(payload?.slug);
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/releases/${slug}`,
    {
      slug: decodeURIComponent(slug),
    },
  );

  return path<TrackDetailsResponse>(['data', 'data'], response);
};

const getTrackDetailPage = async (
  payload: TrackDetailPayload,
): Promise<TrackDetailResponse | undefined> => {
  const trackSlug = payload?.slug;
  const response = await axiosService.get(
    `${TRACK_BASE_URL}/slug/${trackSlug}`,
  );

  return path<TrackDetailResponse>(['data', 'data'], response);
};

const buyTrack = async (
  payload: BuyTrackPayload,
): Promise<Undefinedable<BuyTrackResponse>> => {
  const trackId = payload?.trackId;
  const response = await axiosService.post(`${TRACK_BASE_URL}/${trackId}/buy`, {
    ipAddress: getLocalStorage(IP_ADDRESS),
    country: getLocalStorage(COUNTRY),
  });

  return path<BuyTrackResponse>(['data', 'data'], response);
};

const buyManyTrack = async (payload: BuyManyTrackPayload) => {
  const response = await axiosService.post(`${TRACK_BASE_URL}/buy-many-track`, {
    trackIds: payload,
    ipAddress: getLocalStorage(IP_ADDRESS),
    country: getLocalStorage(COUNTRY),
  });

  return path<BuyManyTrackResponse>(['data', 'data'], response);
};

const createTrackAudioPreview = async payload => {
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/create/audio-preview`,
    payload,
  );

  return response?.data;
};

const createTrackVideoPreview = async payload => {
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/create/video-preview`,
    payload,
  );

  return response?.data;
};

const createTrack = async (
  payload: TrackCreatePayload,
): Promise<Nullable<TrackCreateResponse>> => {
  const response = await axiosService.post(TRACK_BASE_URL, payload);
  return response?.data;
};

const createTrackDraft = async (
  payload: any,
): Promise<Nullable<TrackCreateResponse>> => {
  const response = await axiosService.post(`${TRACK_BASE_URL}/draft`, payload);
  return response?.data;
};

const getMyDraftTracks = async (payload: any): Promise<Nullable<any>> => {
  const response = await axiosService.get(
    `${TRACK_BASE_URL}/me/draft?labelId=${payload.labelId}&search=${payload.search}&type=${payload.type}&sort=${payload.sort}`,
  );
  return response?.data.data;
};

const getFileFromUrlS3 = async url => {
  const response = await axiosService.post(`${FILE_BASE_URL}/blob-file`, {
    url,
  });

  return path<FileFromUrlS3Response>(['data'], response);
};

const getMaxMinTokenTrack = async () => {
  const response = await axiosService.get(`${TRACK_BASE_URL}/price/max-min`);
  return response?.data?.data;
};

const getMyTracksPurchased = async ({
  payload,
}: any): Promise<TrackUploadResponse | undefined> => {
  let search = payload.search.trim();
  const searchQuery = encodeURIComponent(search);
  const sort = payload.sort.trim();
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/me/purchased?search=${searchQuery}&&sort=${sort}`,
    payload.data,
  );
  return path<TrackUploadResponse>(['data', 'data'], response);
};

const getMyTracksStarPurchased = async ({
  payload,
}: any): Promise<TrackUploadResponse | undefined> => {
  const search = payload.search.trim();
  const sort = payload.sort.trim();
  const searchQuery = encodeURIComponent(search);
  const response = await axiosService.post(
    `${STAR_PURCHASES_BASE_URL}/me/tracks?search=${searchQuery}&&sort=${sort}`,
    payload.data,
  );
  return path<TrackUploadResponse>(['data', 'data'], response);
};

const getMyAllTracksPurchased = async ({
  payload,
}: any): Promise<TrackUploadResponse | undefined> => {
  const search = payload.search.trim();
  const sort = payload.sort.trim();
  const searchQuery = encodeURIComponent(search);
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/all-purchases?search=${searchQuery}&&sort=${sort}`,
    payload.data,
  );
  return path<TrackUploadResponse>(['data', 'data'], response);
};

const getMyTracksSubscriptionPurchased = async ({
  payload,
}: any): Promise<TrackUploadResponse | undefined> => {
  const search = payload.search.trim();
  const sort = payload.sort.trim();
  const searchQuery = encodeURIComponent(search);
  const response = await axiosService.post(
    `${SUBSCRIPTION_PURCHASES_BASE_URL}/tracks?search=${searchQuery}&&sort=${sort}`,
    payload?.data,
  );
  return path<TrackUploadResponse>(['data', 'data'], response);
};

const buyTrackByStar = async (
  trackId: any,
): Promise<{ _id: string } | undefined> => {
  const response = await axiosService.post(
    `${TRACK_BASE_URL}/${trackId}/buy-by-star`,
    { ipAddress: getLocalStorage(IP_ADDRESS) },
  );
  return path<{ _id: string }>(['data', 'data'], response);
};

const hideAndHiddenMyTrack = async ({
  track,
}: any): Promise<TrackUploadResponse | undefined> => {
  const response = await axiosService.get(
    `${TRACK_BASE_URL}/${track?._id}/toggle-visibility`,
  );
  return path<TrackUploadResponse>(['data', 'data'], response);
};

const sendSlack = async (payload: {
  text: string;
  block: string;
  channelId: string;
  attachments?: string[];
}): Promise<any> => {
  await axiosService.post(`${TRACK_BASE_URL}/log`, payload);
};

const addRemoveFavoriteTrack = async (trackId: any) => {
  axiosService.get(`${TRACK_BASE_URL}/${trackId}/add-remove-favorite`);
};

const getTrackBySlug = async (slug: string): Promise<any> => {
  const response = await axiosService.get(`${TRACK_BASE_URL}/info/${slug}`);

  return path<any>(['data', 'data'], response);
};

export {
  searchTracks,
  getFullUrlTrack,
  deleteTrack,
  getTracksPurchased,
  updateTrack,
  getTrackDetails,
  createTrackAudioPreview,
  createTrack,
  createTrackVideoPreview,
  buyTrack,
  getFileFromUrlS3,
  buyManyTrack,
  getTrackDetailPage,
  getMaxMinTokenTrack,
  buyTrackBySubscriptionApi,
  getMyTracksPurchased,
  downloadFromMultipleUrls,
  buyTrackByStar,
  getMyTracksStarPurchased,
  createTrackDraft,
  getMyDraftTracks,
  deleteDraftTrack,
  updateDraftTrack,
  getMyAllTracksPurchased,
  getMyTracksSubscriptionPurchased,
  updateSampleOfTrack,
  getRelatedTracksDetails,
  getReleasesTrackDetails,
  updateNumberDownloadTrack,
  hideAndHiddenMyTrack,
  sendSlack,
  publishTracks,
  addRemoveFavoriteTrack,
  getTrackBySlug,
};
