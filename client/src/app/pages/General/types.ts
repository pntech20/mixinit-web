import { Nullable } from 'app/constants/types';
import { General } from 'app/models';

/* --- STATE --- */
export interface GeneralState {
  isScrollPassFilter: boolean;
  generals: any;
  scrollValue: number;
  error: Nullable<Error | string>;
}

export interface GeneralResponse {
  data: General[];
}
