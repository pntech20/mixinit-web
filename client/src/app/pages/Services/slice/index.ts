import { PayloadAction } from '@reduxjs/toolkit';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { servicesSaga } from './saga';
import {
  BuyTokenPackagePayload,
  GetStoragePlansPayload,
  GetStoragePlansResponse,
  GetSubcriptionTiersPayload,
  GetSubscriptionTiersResponse,
  GetTokenPackagesPayload,
  GetTokenPackagesResponse,
  ServicesState,
  SubscribeStoragePlayload,
  SubscribeStorageResponse,
  SubscribeTierPlayload,
  SubscribeTierResponse,
  UnSribeSubscriptionPayload,
  UnsubscribeStorageResponse,
  UnsubscribeTierResponse,
} from './types';

export const initialState: ServicesState = {
  tokenPackages: [],
  tiers: [],
  storagePlans: [],
  error: null,
  currentTierId: null,
  currentStorageId: null,
  isLoading: false,
  isUnSubscribeSuccess: false,
};

const slice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    getTokenPackagesRequest(
      state,
      action: PayloadAction<GetTokenPackagesPayload>,
    ) {
      state.tokenPackages = [];
      state.error = null;
      state.isLoading = true;
    },
    getTokenPackagesSuccess(
      state,
      action: PayloadAction<GetTokenPackagesResponse>,
    ) {
      state.tokenPackages = action.payload.data;
      state.isLoading = false;
    },
    getTokenPackagesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    getStoragePlansRequest(
      state,
      action: PayloadAction<GetStoragePlansPayload>,
    ) {
      state.storagePlans = [];
      state.error = null;
      state.isLoading = true;
    },

    getStoragePlansSuccess(
      state,
      action: PayloadAction<GetStoragePlansResponse>,
    ) {
      const item =
        action.payload.data &&
        action.payload.data.find(storage => storage.isCurrentStorage);
      state.storagePlans = action.payload.data;
      state.currentStorageId = item ? item._id : null;
      state.isLoading = false;
    },

    getStoragePlansFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    getSubcriptionTiersRequest(
      state,
      action: PayloadAction<GetSubcriptionTiersPayload>,
    ) {
      state.tiers = [];
      state.error = null;
      state.isLoading = true;
      state.currentTierId = null;
    },
    getSubcriptionTiersSuccess(
      state,
      action: PayloadAction<GetSubscriptionTiersResponse>,
    ) {
      const item =
        action.payload.data &&
        action.payload.data.find(tier => tier.isCurrentTier);
      state.tiers = action.payload.data;
      state.isLoading = false;
      state.currentTierId = item ? item._id : null;
    },
    getSubcriptionTiersFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    unsubscribeSubscriptionRequest(
      state,
      action: PayloadAction<UnSribeSubscriptionPayload>,
    ) {
      state.isUnSubscribeSuccess = false;
      state.error = null;
    },
    unsubscribeSubscriptionSuccess(state, action: PayloadAction<any>) {
      const pacIndex = state.tokenPackages.findIndex(
        it => it._id === action.payload.packageId,
      );
      state.tokenPackages[pacIndex] = {
        ...state.tokenPackages[pacIndex],
        isSubscribe: action.payload.isSubscribe,
      };
      state.isUnSubscribeSuccess = true;
    },

    // SUBSCRIBE TIER
    subscribeTierRequest(
      state,
      action: PayloadAction<SubscribeTierPlayload>,
    ) {},
    subscribeTierSuccess(state, action: PayloadAction<SubscribeTierResponse>) {
      toastSuccess('Success');
      state.isLoading = false;
      state.currentTierId = action.payload?.tierId;
    },

    subscribeTierFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    unsubscribeTierRequest(state) {},

    // UNSUBSCRIBE TIER
    unsubscribeTierSuccess(
      state,
      action: PayloadAction<UnsubscribeTierResponse>,
    ) {
      toastSuccess('Success');
      state.currentTierId = action.payload?.tier?._id;
      state.isLoading = false;
    },

    unsubscribeTierFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // SUBSCRIBE STORAGE
    // const subscribeStorageRequest: Handler<State> = state => state;
    subscribeStorageRequest(
      state,
      action: PayloadAction<SubscribeStoragePlayload>,
    ) {},
    subscribeStorageSuccess(
      state,
      action: PayloadAction<SubscribeStorageResponse>,
    ) {
      state.isLoading = false;
    },
    subscribeStorageFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    // UNSUBSCRIBE STORAGE
    // const unsubscribeStorageRequest: Handler<State> = state => state;
    unsubscribeStorageRequest(state) {},

    unsubscribeStorageSuccess(
      state,
      action: PayloadAction<UnsubscribeStorageResponse>,
    ) {
      toastSuccess('Unsubscribe Success');
      state.isLoading = false;
    },

    unsubscribeStorageFailure(state, action: PayloadAction<string>) {
      toastError(action.payload);
      state.error = action.payload;
      state.isLoading = false;
    },
    buyTokenPackageRequest(
      state,
      action: PayloadAction<BuyTokenPackagePayload>,
    ) {
      state.error = null;
    },
    buyTokenPackageSuccess(state, action: PayloadAction<any>) {
      const pacIndex = state.tokenPackages.findIndex(
        it => it._id === action.payload.packageId,
      );
      state.tokenPackages[pacIndex] = {
        ...state.tokenPackages[pacIndex],
        isSubscribe: true,
        // labelsIncluded: state.tokenPackages[pacIndex]?.labelsIncluded?.map(
        //   label => ({
        //     ...label,
        //     remainingDownloadsPerMonth: action.payload.maxDownloadsPerMonth,
        //   }),
        // ),
      };
    },
  },
});

export const { actions } = slice;

export const useServicesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: servicesSaga });
  return { actions: slice.actions };
};
