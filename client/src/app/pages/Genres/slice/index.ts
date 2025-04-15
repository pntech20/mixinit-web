import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { genresSaga } from './saga';
import {
  GetGenresPayload,
  GenresResponse,
  GenresState,
  GenreResponse,
} from './types';

export const initialState: GenresState = {
  genres: [],
  error: null,
  genre: null,
  isLoading: false,
  topGenres: {},
};

const slice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    getGenresRequest(state, action: PayloadAction<GetGenresPayload>) {
      state.genres = [];
      state.error = null;
      state.isLoading = true;
    },
    getGenresSuccess(state, action: PayloadAction<GenresResponse>) {
      state.genres = action.payload.genres;
      state.isLoading = false;
    },
    getGenresFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    getGenreDetailRequest(state, action: PayloadAction<string>) {
      state.genre = null;
      state.error = null;
    },
    getGenreDetailSuccess(state, action: PayloadAction<GenreResponse>) {
      state.genre = action.payload;
    },
    getGenreDetailFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    topGenre(state, action: PayloadAction<any>) {
      state.topGenres[action.payload.cacheKey] = action.payload.data;
    },
  },
});

export const { actions } = slice;

export const useGenresSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: genresSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useGenresSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
