import { useDisclosure } from '@chakra-ui/react';
import { useSubscriptionsSlice } from 'app/pages/Subscriptions/slice';
import { selectSubscriptionSlice } from 'app/pages/Subscriptions/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useSubscriptions = () => {
  const dispatch = useDispatch();
  const { actions } = useTrackSlice();
  const { actions: actionsSubscription } = useSubscriptionsSlice();
  // TODO: rename subscriptions to currentSubscription
  const { subscriptions } = useSelector(selectSubscriptionSlice);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const buyTrackBySubscription = useCallback(
    trackId => {
      const data = {
        trackId,
      };
      dispatch(actions.buyTrackBySubscriptionRequest(data));
      dispatch(actions.buyTrackIdBySub(trackId));
    },
    [actions, dispatch],
  );

  const getMySubscription = useCallback(() => {
    dispatch(actionsSubscription.getMySubscriptionsRequest());
  }, [actionsSubscription, dispatch]);

  useEffect(() => {
    dispatch(actions.setIsCheckOpenModelBuySubscription(isOpen));
  }, [actions, dispatch, isOpen]);

  return {
    buyTrackBySubscription,
    isOpen,
    onClose,
    onOpen,
    getMySubscription,
    subscriptions,
  };
};
