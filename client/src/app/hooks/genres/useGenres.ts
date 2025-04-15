import { useGenresSlice } from 'app/pages/Genres/slice';
import { selectSliceGenres } from 'app/pages/Genres/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useGenres = () => {
  const { genres, isLoading, topGenres } = useSelector(selectSliceGenres);

  const dispatch = useDispatch();
  const { actions } = useGenresSlice();
  const onGetGenres = useCallback(
    (payload?: any) => {
      dispatch(actions.getGenresRequest(payload));
    },
    [actions, dispatch],
  );

  const onTopGenres = useCallback(
    (data?: any) => {
      dispatch(actions.topGenre(data));
    },
    [actions, dispatch],
  );

  return {
    onGetGenres,
    genres,
    isLoading,
    onTopGenres,
    topGenres,
  };
};
