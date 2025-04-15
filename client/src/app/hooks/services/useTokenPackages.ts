import { useDispatch, useSelector } from 'react-redux';
import { selectSlicesTokenPackages } from 'app/pages/Services/slice/selectors';
import { useCallback, useState } from 'react';
import { useServicesSlice } from 'app/pages/Services/slice';
import { Token } from 'app/models';
import { getLocalStorage } from 'app/helpers/local-storage';
import { COUNTRY, IP_ADDRESS } from 'app/constants';
import { sendSlack } from 'app/apis/track';
import { SLACK_CHANNELS } from 'app/constants/enum';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import {
  completeSubscription,
  createSubscription,
} from 'app/apis/services/tokenPackages';
import { useGlobalLoadingSlice } from 'app/components/Loading/slice';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { useHistory } from 'react-router-dom';

export const useTokenPackages = () => {
  const { tokenPackages, isLoading, isUnSubscribeSuccess } = useSelector(
    selectSlicesTokenPackages,
  );
  const [isLoadingCreateSubscription, setIsLoadingCreateSubscription] =
    useState(false);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoadingUnSub, setLoadingUnSub] = useState<boolean>(false);
  const [selectedTokenPackage, setSelectedTokenPackage] = useState<Token>();
  const dispatch = useDispatch();
  const { actions } = useServicesSlice();
  const { userDetail } = useSelector(selectAuth);
  const { actions: globalLoadingActions } = useGlobalLoadingSlice();
  const history = useHistory();

  const onGetTokenPackages = useCallback(() => {
    dispatch(actions.getTokenPackagesRequest({}));
  }, [actions, dispatch]);

  const toggleModalBuyTokens = useCallback(() => {
    setIsVisible(prevIsVisible => !prevIsVisible);
  }, []);

  const onBuyTokensSuccess = useCallback(
    async details => {
      // const paypalTransactionId =
      //   details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || '';

      toggleModalBuyTokens();
      dispatch(
        actions.buyTokenPackageRequest({
          packageId: selectedTokenPackage?._id,
          ipAddress: getLocalStorage(IP_ADDRESS),
          country: getLocalStorage(COUNTRY),
          subscriptionID: details?.subscriptionID || '',
        }),
      );
    },
    [actions, dispatch, selectedTokenPackage?._id, toggleModalBuyTokens],
  );

  const handleCreateSubscription = async () => {
    try {
      setIsLoadingCreateSubscription(true);
      const res: any = await createSubscription(selectedTokenPackage?.planId);
      if (res.links && res.links.length > 0) {
        const paypalUrls = res.links;
        const approveUrlPaypal = paypalUrls?.find(
          (url: any) => url?.rel === 'approve',
        );
        setIsLoadingCreateSubscription(false);
        window.location.assign(approveUrlPaypal?.href);
        return;
      }
    } catch (error) {
      setIsLoadingCreateSubscription(false);
      toastError('Register subscription failed');
    }
  };

  const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
      plan_id: selectedTokenPackage?.planId,
    });
  };

  const handleClickBuyTokens = useCallback(
    async tokenPackage => {
      sendSlack({
        text: '👀 Opened Modal Subscribe',
        block: '👀 Opened Modal Subscribe',
        channelId: SLACK_CHANNELS.PAYPAL,
        attachments: [
          `Package price: ${tokenPackage?.price}`,
          `User ID: ${userDetail?._id}`,
        ],
      });
      setSelectedTokenPackage(tokenPackage);
      toggleModalBuyTokens();
    },
    [toggleModalBuyTokens, userDetail?._id],
  );

  const handleClickUnScribe = useCallback(
    tokenPackage => {
      dispatch(
        actions.unsubscribeSubscriptionRequest({
          packageId: tokenPackage?._id,
        }),
      );
    },
    [actions, dispatch],
  );

  const handleCompleteSubscription = useCallback(
    async subscriptionId => {
      try {
        dispatch(globalLoadingActions.showLoading());
        await completeSubscription(subscriptionId);
        dispatch(globalLoadingActions.hideLoading());
        history.push('/services');
        toastSuccess('Checkout success');
      } catch (error: any) {
        dispatch(globalLoadingActions.hideLoading());
        toastError(
          error?.response?.data?.message || 'Payment subscription failed',
        );
      }
    },
    [dispatch, globalLoadingActions, history],
  );

  return {
    tokenPackages,
    isLoading,
    isVisible,
    selectedTokenPackage,
    onGetTokenPackages,
    handleClickBuyTokens,
    onBuyTokensSuccess,
    toggleModalBuyTokens,
    paypalSubscribe,
    handleClickUnScribe,
    isUnSubscribeSuccess,
    setSelectedTokenPackage,
    isLoadingUnSub,
    setLoadingUnSub,
    setIsVisible,
    handleCreateSubscription,
    handleCompleteSubscription,
    isLoadingCreateSubscription,
  };
};
