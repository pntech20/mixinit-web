import { useGeneralSlice } from 'app/pages/General';
import { selectSliceGenerals } from 'app/pages/General/selector';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useGeneral = () => {
  const { isScrollPassFilter, generals, scrollValue } =
    useSelector(selectSliceGenerals);

  const dispatch = useDispatch();
  const { actions } = useGeneralSlice();
  const inputRef = useRef<HTMLDivElement | null>(null);

  const scrollHandler = useCallback(() => {
    const rect = inputRef.current!.getBoundingClientRect();

    dispatch(actions.setScrollValue(rect.top));
  }, [actions, dispatch]);

  const onGetGeneral = useCallback(() => {
    dispatch(actions.getGeneralRequest());
  }, [actions, dispatch]);

  const setIsScrollPastFilter = useCallback(() => {
    dispatch(actions.setIsScrollPastFilter());
  }, [actions, dispatch]);

  const setIsNotScrollPastFilter = useCallback(() => {
    dispatch(actions.setIsNotScrollPastFilter());
  }, [actions, dispatch]);

  useEffect(() => {
    if (!inputRef.current) return;
    window.addEventListener('scroll', scrollHandler, true);
    return () => {
      window.removeEventListener('scroll', scrollHandler, true);
    };
  }, [scrollHandler]);

  return {
    onGetGeneral,
    generals,
    isScrollPassFilter,
    setIsScrollPastFilter,
    setIsNotScrollPastFilter,
    scrollValue,
    inputRef,
  };
};
