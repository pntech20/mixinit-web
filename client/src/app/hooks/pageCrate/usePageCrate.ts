import { useDisclosure } from '@chakra-ui/hooks';
import { useCratesSlice } from 'app/pages/PageCrate/slice';
import { selectSliceCrates } from 'app/pages/PageCrate/slice/selector';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePageCrates = (type, isHideClick) => {
  const dispatch = useDispatch();

  const { actions } = useCratesSlice();
  const { myTrackCrates, filterRules } = useSelector(selectSliceCrates);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [valueCrate, setValueCrate] = useState<any>(null);
  const [color, setColor] = useState<string>('#3cd6bf');
  const [crateId, setCrateId] = useState<string>('');
  const [listCrate, setListCrate] = useState<any>([]);
  const [isShowCrates, setIsShowCrates] = useState<boolean>(false);
  const [isPageCrate, setIsPageCrate] = useState(false);

  const onGetMyCrates = useCallback(
    type => {
      dispatch(actions.getMyCratesRequest({ type }));
    },
    [actions, dispatch],
  );
  const handleToggleCrate = useCallback(() => {
    setIsShowCrates(prev => !prev);
    onOpen();
    if (type === 'crateEditor') {
      setIsPageCrate(true);
    }
  }, [onOpen, type]);

  const handleClosePageCrate = useCallback(() => {
    onClose();
    setIsPageCrate(false);
  }, [onClose]);

  useEffect(() => {
    onGetMyCrates('track');
  }, [onGetMyCrates]);

  return {
    onGetMyCrates,
    setListCrate,
    setCrateId,
    setColor,
    setValueCrate,
    onOpen,
    onClose,
    handleToggleCrate,
    handleClosePageCrate,
    setIsPageCrate,
    isPageCrate,
    isOpen,
    myTrackCrates,
    valueCrate,
    color,
    crateId,
    listCrate,
    isShowCrates,
    filterRules,
  };
};
