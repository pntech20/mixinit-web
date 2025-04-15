import { useBannerSlice } from 'app/pages/Banner/slice';
import { selectSliceBanners } from 'app/pages/Banner/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useBanners = () => {
  const { banners } = useSelector(selectSliceBanners);

  const dispatch = useDispatch();
  const { actions } = useBannerSlice();
  const onGetBanners = useCallback(() => {
    dispatch(actions.getBannerRequest());
  }, [actions, dispatch]);

  return {
    onGetBanners,
    banners,
  };
};
