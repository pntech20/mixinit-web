import { getOrder } from 'app/apis/order';
import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { actions as actionsInput } from 'app/components/InputSearch/slice/index';

export const useOrder = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const timeoutRef = useRef<any>(null);

  const getDataOrder = useCallback(async () => {
    const payload = { search: '' };
    const data = await getOrder(payload);
    dispatch(actionsInput.setIsOnchangeInput(false));
    setDataOrder(data.data.data);
    setIsLoading(false);
  }, [dispatch]);

  const handleOnchangeSearch = useCallback(
    (e: any) => {
      setSearchValue(e.target.value);
      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }
      setSearchValue(e.target.value);

      timeoutRef.current = setTimeout(async () => {
        const payload = { search: e.target.value };
        setIsLoading(true);
        const data = await getOrder(payload);
        dispatch(actionsInput.setIsOnchangeInput(false));
        setIsLoading(false);
        setDataOrder(data.data.data);
      }, 1500);
    },
    [dispatch],
  );

  return {
    setSearchValue,
    searchValue,
    getDataOrder,
    dataOrder,
    handleOnchangeSearch,
    isLoading,
  };
};
