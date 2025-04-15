import { useDisclosure } from '@chakra-ui/react';
import { checkoutMyWishlist } from 'app/apis/wishlist';
import { onCompleteOrder } from 'app/apis/wishlist/wishlist';
import { useGlobalLoadingSlice } from 'app/components/Loading/slice';
import { SORT_TYPE } from 'app/constants/enum';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { useAuthSlice } from 'app/pages/Login/slice';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import { useWishlistsSlice } from 'app/pages/Wishlist/slice';
import { selectSliceWishlists } from 'app/pages/Wishlist/slice/selectors';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const useWishlists = () => {
  const history = useHistory();
  const { userDetail } = useSelector(selectAuth);
  const pathname = window?.location?.pathname;

  const isMyLibrary = useMemo(() => {
    return pathname.includes('/my-library');
  }, [pathname]);

  const {
    myWishlists,
    isCheckOpenModelAddTrackToCart,
    isAddedTracksOrRelease,
    addedTrackIdOrReleaseId,
    isLoadingWishlist,
  } = useSelector(selectSliceWishlists);
  const {
    isOpen: isShowModalDelete,
    onOpen: onOpenModalDelete,
    onClose: onCloseModalDelete,
  } = useDisclosure();

  const {
    isOpen: isShowModalMessageRemove,
    onOpen: onOpenModalMessageRemove,
    onClose: onCloseModalMessageRemove,
  } = useDisclosure();

  const {
    isOpen: isShowModalPaypalCheckout,
    onOpen: onOpenModalPaypalCheckout,
    onClose: onCloseModalPaypalCheckout,
  } = useDisclosure();

  const {
    isOpen: isShowModalBuyTrackByStar,
    onOpen: onOpenModalBuyTrackByStar,
    onClose: onCloseModalBuyTrackByStar,
  } = useDisclosure();

  const {
    isOpen: isShowModalTrackBelongRelease,
    onOpen: onOpenModalTrackBelongRelease,
    onClose: onCloseModalTrackBelongRelease,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoadingBuyTrack } = useSelector(selectSliceTracks);

  const dispatch = useDispatch();
  const { actions } = useWishlistsSlice();
  const { actions: actionsUser } = useAuthSlice();

  const actionsTracks = useTrackSlice();
  const { actions: globalLoadingActions } = useGlobalLoadingSlice();
  const onGetMyWishlists = useCallback(() => {
    dispatch(actions.getWishlistRequest());
  }, [actions, dispatch]);

  useEffect(() => {
    dispatch(actions.setIsCheckOpenModelAddTrackToCart(isOpen));
  }, [actions, dispatch, isOpen]);

  const handleAddTrackToWishlist = useCallback(
    trackId => {
      if (userDetail?.isPendingPayment) {
        toastError(
          'You have one pending order. Please check your Paypal transaction and get it completed.',
        );
        return;
      }
      dispatch(actions.addTrackToMyWishlistRequest(trackId));
      onClose();
    },
    [actions, dispatch, onClose, userDetail?.isPendingPayment],
  );

  const handleAddReleaseToWishlist = useCallback(
    releaseId => {
      if (userDetail?.isPendingPayment) {
        toastError(
          'You have one pending order. Please check your Paypal transaction and get it completed.',
        );
        return;
      }
      dispatch(actions.addReleaseToMyWishlistRequest(releaseId));
      onClose();
    },
    [actions, dispatch, onClose, userDetail?.isPendingPayment],
  );

  const handleAfterRemoveTrackToWishlist = useCallback(
    trackIds => {
      dispatch(actions.removeTrackToMyWishlistRequest(trackIds));
      onClose();
      onCloseModalDelete();
      onCloseModalMessageRemove();
    },
    [actions, dispatch, onClose, onCloseModalDelete, onCloseModalMessageRemove],
  );

  const handleRemoveTrackToWishlist = useCallback(
    trackIds => {
      if (userDetail?.isPendingPayment) {
        toastError(
          'You have one pending order. Please check your Paypal transaction and get it completed.',
        );
        return;
      }
      handleAfterRemoveTrackToWishlist(trackIds);
    },
    [handleAfterRemoveTrackToWishlist, userDetail?.isPendingPayment],
  );

  const handleRemoveReleaseToMyWishlist = useCallback(
    trackIds => {
      if (userDetail?.isPendingPayment) {
        toastError(
          'You have one pending order. Please check your Paypal transaction and get it completed.',
        );
        return;
      }
      dispatch(actions.removeReleaseToMyWishlistRequest(trackIds));
      onClose();
      onCloseModalDelete();
      onCloseModalMessageRemove();
    },
    [
      actions,
      dispatch,
      onClose,
      onCloseModalDelete,
      onCloseModalMessageRemove,
      userDetail?.isPendingPayment,
    ],
  );

  const onCheckoutSuccess = async data => {
    try {
      dispatch(globalLoadingActions.showLoading());
      await checkoutMyWishlist(data);

      dispatch(actions.checkoutToMyWishlistSuccess());

      dispatch(globalLoadingActions.hideLoading());
      if (isMyLibrary) {
        const data = {
          clean: true,
          dirty: true,
        };
        dispatch(
          actionsTracks.actions.getMyTracksPurchasedRequest({
            sort: SORT_TYPE.CREATED_AT_PURCHASE_DESC,
            search: '',
            data,
          }),
        );
        dispatch(
          actionsTracks.actions.getMyAllTracksPurchasedRequest({
            sort: SORT_TYPE.CREATED_AT_PURCHASE_DESC,
            search: '',
            data,
          }),
        );
      } else history.push('/my-library');
      toastSuccess('Checkout success');
    } catch (error: any) {
      dispatch(globalLoadingActions.hideLoading());
      toastError(error?.response?.data?.message || 'Payment failed');
    }
  };

  const handleCompleteOrder = useCallback(
    async token => {
      try {
        dispatch(globalLoadingActions.showLoading());
        await onCompleteOrder(token);
        dispatch(actions.checkoutToMyWishlistSuccess());
        dispatch(globalLoadingActions.hideLoading());
        history.push('/my-library');
        toastSuccess('Checkout success');
      } catch (error: any) {
        dispatch(globalLoadingActions.hideLoading());
        dispatch(actionsUser.getMe());
        toastError(error?.response?.data?.message || 'Payment failed');
      }
    },
    [actions, actionsUser, dispatch, globalLoadingActions, history],
  );

  const buyTrackByStar = async trackId => {
    dispatch(actionsTracks.actions.buyTrackByStarRequest(trackId));
  };

  return {
    onGetMyWishlists,
    myWishlists,
    handleAddTrackToWishlist,
    handleRemoveTrackToWishlist,
    isOpen,
    onOpen,
    onClose,
    isShowModalDelete,
    onOpenModalDelete,
    onCloseModalDelete,
    isShowModalMessageRemove,
    onOpenModalMessageRemove,
    onCloseModalMessageRemove,
    handleAddReleaseToWishlist,
    isShowModalPaypalCheckout,
    onOpenModalPaypalCheckout,
    onCloseModalPaypalCheckout,
    handleRemoveReleaseToMyWishlist,
    onCheckoutSuccess,
    userDetail,
    isShowModalBuyTrackByStar,
    onOpenModalBuyTrackByStar,
    onCloseModalBuyTrackByStar,
    buyTrackByStar,
    isLoadingBuyTrack,
    isCheckOpenModelAddTrackToCart,
    isShowModalTrackBelongRelease,
    onOpenModalTrackBelongRelease,
    onCloseModalTrackBelongRelease,
    isAddedTracksOrRelease,
    addedTrackIdOrReleaseId,
    isLoadingWishlist,
    handleCompleteOrder,
  };
};
