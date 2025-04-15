import { useTrackKeysSlice } from 'app/pages/TrackKeys/slice';
import { selectSliceTrackKeys } from 'app/pages/TrackKeys/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useTracksKeys = () => {
  const { trackKeys } = useSelector(selectSliceTrackKeys);
  const dispatch = useDispatch();
  const { actions } = useTrackKeysSlice();

  const onGetTrackKeys = useCallback(() => {
    dispatch(actions.getTrackKeysRequest());
  }, [actions, dispatch]);

  return {
    onGetTrackKeys,
    trackKeys,
  };
};
