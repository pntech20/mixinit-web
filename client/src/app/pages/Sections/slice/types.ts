import { Nullable } from 'app/constants/types';
import { IPagination, Section } from 'app/models';

/* --- STATE --- */
export interface SectionsState {
  error: Nullable<Error | string>;
  section: Nullable<Section>;
  sections: Array<Section>;
  allLabels: Array<Section>;
  isLoading: boolean;
  pagination: IPagination | null;
  sectionDetail: Nullable<Section>;
  slug: string;
  sectionId: string;
  mySection: any;
  topLabels: any;
  isLoadingTopLabels: boolean;
  cacheLabels: any;
}

export interface SectionsResponse {
  listSections: Array<Section>;
}

export interface MySectionsResponse {
  mySection: Section;
}
export interface GetSectionsPayload {
  params: string;
  filter: any;
}

export interface getLabelDetailPayload {
  labelId: string;
}

export interface getLabelDetailResponse {
  labelDetail: Section;
}
