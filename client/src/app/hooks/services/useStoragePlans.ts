import { useServicesSlice } from 'app/pages/Services/slice';
import { selectSlicesTokenPackages } from 'app/pages/Services/slice/selectors';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Storage } from 'app/models';

export const useStoragePlans = () => {
  const dispatch = useDispatch();

  const { actions } = useServicesSlice();
  const { storagePlans, isLoading, currentStorageId } = useSelector(
    selectSlicesTokenPackages,
  );

  const [selectedStorage, setSelectedStorage] = useState<Storage>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isVisibleUnsubscribe, setIsVisibleUnsubscribe] =
    useState<boolean>(false);

  const toggleModalSubscribeStorage = useCallback(() => {
    setIsVisible(prevIsVisible => !prevIsVisible);
  }, []);

  const toggleModalUnsubscribeStorage = useCallback(() => {
    setIsVisibleUnsubscribe(
      prevIsVisibleUnsubscribe => !prevIsVisibleUnsubscribe,
    );
  }, []);

  const onSubscribeStorageSuccess = useCallback(
    data => {
      toggleModalSubscribeStorage();
      dispatch(
        actions.subscribeStorageRequest({
          storageId: selectedStorage?._id,
          paypalOrderId: data?.orderID,
          paypalStorageSubscriptionId: data?.subscriptionID,
        }),
      );
    },
    [actions, dispatch, selectedStorage?._id, toggleModalSubscribeStorage],
  );

  const handleUnsubscribeStorage = useCallback(() => {
    toggleModalUnsubscribeStorage();
    dispatch(actions.unsubscribeStorageRequest());
  }, [actions, dispatch, toggleModalUnsubscribeStorage]);

  const handleClickSubscribeStorage = useCallback(
    storage => {
      if (storage.paypalPlan) {
        setSelectedStorage(storage);
        toggleModalSubscribeStorage();
      } else {
        dispatch(
          actions.subscribeStorageRequest({
            storageId: storage._id,
            paypalOrderId: '',
            paypalStorageSubscriptionId: '',
          }),
        );
      }
    },
    [actions, dispatch, toggleModalSubscribeStorage],
  );

  const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
      plan_id: selectedStorage?.paypalPlan,
    });
  };

  const onGetStoragePlans = useCallback(() => {
    dispatch(actions.getStoragePlansRequest({}));
  }, [actions, dispatch]);

  const handleClickUnSubscribeStorage = useCallback(
    () => toggleModalUnsubscribeStorage(),
    [toggleModalUnsubscribeStorage],
  );

  return {
    storagePlans,
    onGetStoragePlans,
    isLoading,
    isVisible,
    isVisibleUnsubscribe,
    currentStorageId,
    selectedStorage,
    toggleModalSubscribeStorage,
    toggleModalUnsubscribeStorage,
    handleUnsubscribeStorage,
    handleClickUnSubscribeStorage,
    paypalSubscribe,
    onSubscribeStorageSuccess,
    handleClickSubscribeStorage,
  };
};
