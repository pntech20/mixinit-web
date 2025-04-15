import { Nullable } from 'app/constants/types';
import { Sample } from 'app/models';

/* --- STATE --- */
export interface SamplesState {
  error: Nullable<Error | string>;
  samples: Array<Sample>;
  sample: Nullable<Sample>;
}

export interface GetSamplesPayload {
  limit: number;
}

export interface CreateSamplePayload {
  track: string;
  originalTrackUrl: string;
  source: string;
}

export interface SamplesResponse {
  samples: Array<Sample>;
}

export interface SampleResponse {
  sample: Sample;
}
