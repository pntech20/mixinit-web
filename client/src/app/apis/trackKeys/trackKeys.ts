import { Nullable } from 'app/constants/types';
import {
  GetTrackKeysPayload,
  TrackKeysResponse,
} from 'app/pages/TrackKeys/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const TRACK_KEY_BASE_URL = '/v1/track-keys';

export const getTrackKeys = async (
  payload: GetTrackKeysPayload,
): Promise<Nullable<TrackKeysResponse> | undefined> => {
  const response = await axiosService.get(TRACK_KEY_BASE_URL);

  return path<TrackKeysResponse>(['data', 'data'], response);
};

export const createTrackKey = async data => {
  const response = await axiosService.post(TRACK_KEY_BASE_URL, data);

  return path<TrackKeysResponse>(['data', 'data'], response);
};
