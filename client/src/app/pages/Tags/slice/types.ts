import { Nullable } from 'app/constants/types';
import { Tag } from 'app/models';

/* --- STATE --- */
export interface TagsState {
  error: Nullable<Error | string>;
  tags: Array<Tag>;
  tag: any;
  isLoading: boolean;
  topTags: any;
}

export interface TagsResponse {
  tags: Array<Tag>;
}

export interface TagResponse {
  tag: Tag;
}

export interface GetTagsPayload {
  search?: string;
  sort?: any;
}

export interface GetTopTagsQuery {
  dateRange?: number;
  labelId?: string;
}
