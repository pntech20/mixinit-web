import { Nullable } from 'app/constants/types';
import { Genre } from 'app/models';

/* --- STATE --- */
export interface GenresState {
  error: Nullable<Error | string>;
  genres: Array<Genre>;
  genre: any;
  isLoading: boolean;
  topGenres: any;
}

export interface GenresResponse {
  genres: Array<Genre>;
}

export interface GenreResponse {
  genre: Genre;
}

export interface GetGenresPayload {
  limit: number;
  sort?: string;
  search?: string;
}

export interface GetTopGenresQuery {
  dateRange?: number;
  labelId?: string;
}
