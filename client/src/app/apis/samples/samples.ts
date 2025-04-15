import { Nullable } from 'app/constants/types';
import {
  CreateSamplePayload,
  GetSamplesPayload,
  SampleResponse,
  SamplesResponse,
} from 'app/pages/Samples/slice/types';
import axiosService from 'app/services/axios.service';
import { path } from 'ramda';

const SAMPLE_BASE_URL = '/v1/samples';

export const getSamples = async (
  payload: GetSamplesPayload,
): Promise<Nullable<SamplesResponse> | undefined> => {
  const response = await axiosService.get(SAMPLE_BASE_URL);

  return path<SamplesResponse>(['data', 'data'], response);
};

export const createSample = async (
  payload: CreateSamplePayload,
): Promise<Nullable<SampleResponse> | undefined> => {
  const response = await axiosService.post(SAMPLE_BASE_URL, payload);

  return path(['data', 'data'], response);
};
