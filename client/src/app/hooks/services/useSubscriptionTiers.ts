import { SubcriptionTier } from 'app/models';
import { useServicesSlice } from 'app/pages/Services/slice';
import { selectSlicesTokenPackages } from 'app/pages/Services/slice/selectors';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useSubscriptionTiers = () => {
  const { tiers, isLoading, currentTierId } = useSelector(
    selectSlicesTokenPackages,
  );
  const dispatch = useDispatch();
  const [selectedTier, setSelectedTier] = useState<SubcriptionTier>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isVisibleUnsubscribe, setIsVisibleUnsubscribe] =
    useState<boolean>(false);
  const { actions } = useServicesSlice();

  const toggleModalSubscribeTier = useCallback(() => {
    setIsVisible(prevIsVisible => !prevIsVisible);
  }, []);

  const toggleModalUnsubscribeTier = useCallback(() => {
    setIsVisibleUnsubscribe(
      prevIsVisibleUnsubscribe => !prevIsVisibleUnsubscribe,
    );
  }, []);

  const onSubscribeTierSuccess = useCallback(
    data => {
      toggleModalSubscribeTier();
      dispatch(
        actions.subscribeTierRequest({
          tierId: selectedTier?._id,
          paypalOrderId: data?.orderID,
          paypalTierSubscriptionId: data?.subscriptionID,
        }),
      );
    },
    [toggleModalSubscribeTier, dispatch, actions, selectedTier?._id],
  );

  const handleUnsubscribeTier = useCallback(() => {
    toggleModalUnsubscribeTier();
  }, [toggleModalUnsubscribeTier]);

  const handleClickSubscribeTier = useCallback(
    tier => {
      if (tier.paypalPlan) {
        setSelectedTier(tier);
        toggleModalSubscribeTier();
      } else {
        dispatch(
          actions.subscribeTierRequest({
            tierId: tier._id,
            paypalOrderId: '',
            paypalTierSubscriptionId: '',
          }),
        );
      }
    },
    [actions, dispatch, toggleModalSubscribeTier],
  );

  const handleClickUnsubscribeTier = useCallback(
    isFreeTier => {
      if (!isFreeTier) {
        toggleModalUnsubscribeTier();
      }
    },
    [toggleModalUnsubscribeTier],
  );

  const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
      plan_id: selectedTier?.paypalPlan,
    });
  };

  const onGetTiers = useCallback(() => {
    dispatch(actions.getSubcriptionTiersRequest({}));
  }, [actions, dispatch]);

  return {
    tiers,
    isLoading,
    onGetTiers,
    isVisible,
    selectedTier,
    isVisibleUnsubscribe,
    currentTierId,
    onSubscribeTierSuccess,
    toggleModalSubscribeTier,
    handleClickSubscribeTier,
    paypalSubscribe,
    handleClickUnsubscribeTier,
    toggleModalUnsubscribeTier,
    handleUnsubscribeTier,
  };
};
