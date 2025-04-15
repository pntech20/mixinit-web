import { useSamplesSlice } from 'app/pages/Samples/slice';
import { selectSliceSamples } from 'app/pages/Samples/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useSamples = () => {
  const { samples } = useSelector(selectSliceSamples);
  const dispatch = useDispatch();
  const { actions } = useSamplesSlice();

  const onGetSamples = useCallback(
    (data = { limit: 0 }) => {
      dispatch(actions.getSamplesRequest());
    },
    [actions, dispatch],
  );

  return {
    onGetSamples,
    samples,
  };
};
