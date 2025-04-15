import { useTagsSlice } from 'app/pages/Tags/slice';
import { selectSliceTags } from 'app/pages/Tags/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useTags = () => {
  const { tags, tag, isLoading, topTags } = useSelector(selectSliceTags);
  const dispatch = useDispatch();
  const { actions } = useTagsSlice();
  const onGetTags = useCallback(
    (payload?: any) => {
      dispatch(actions.getTagsRequest(payload));
    },
    [actions, dispatch],
  );

  const onTopTags = useCallback(
    (data?: any) => {
      dispatch(actions.topTags(data));
    },
    [actions, dispatch],
  );

  return {
    onGetTags,
    tags,
    tag,
    isLoading,
    onTopTags,
    topTags,
  };
};
