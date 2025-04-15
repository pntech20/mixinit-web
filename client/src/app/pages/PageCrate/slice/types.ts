import { Crate, User } from 'app/models';

export interface GetListCratesPayload {
  type: string;
}

export interface ListCratesResponse {
  crates: Crate[];
}

export interface CrateResponse {
  crate: Crate;
}

export interface Rule {
  _id: string;
  field: string;
  labelField: string;
  typeField: string;
  match: string;
  labelMatch: string;
  value: any;
}

export interface CreateCratePayload {
  name: string;
  rules: Array<Rule>;
  color: string;
  type: string;
}

export interface EditCratePayload {
  _id?: string;
  name?: string;
  bpmFrom?: number;
  bpmTo?: number;
  priceFrom?: number;
  priceTo?: number;
  yearFrom?: number;
  yearTo?: number;
  showGenres?: string;
  showSections?: string;
  showContributors?: string;
  showTrackKeys?: string;
  sort?: string;
  dateRange?: string;
  showTags?: Array<string>;
  clean?: boolean;
  dirty: boolean;
  showAudio?: boolean;
  showVideo?: boolean;
  user?: User;
}

export interface GetMyCratePayload {
  type: string;
}

export interface DeleteCratePayload {
  crateId: string;
}

export interface CreatesState {
  crates: Crate[];
  myTrackCrates: Array<Crate>;
  error: string | null;
  pagination: any;
  isLoading: boolean;
  filterRules: any;
  isSaveCrate: boolean;
  valueNameCrate: string;
  isEditCrate: boolean;
  payloadCrate?: any;
}
