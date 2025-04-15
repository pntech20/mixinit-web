import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { SubscriptionsState } from './types';
import { subscriptionsSaga } from './saga';

export const initialState: SubscriptionsState = {
  subscriptions: null,
};

const slice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    getMySubscriptionsRequest(state) {
      state.subscriptions = null;
    },
    getMySubscriptionsSuccess(state, action: PayloadAction<any>) {
      state.subscriptions = action.payload;
    },

    updateSubscriptionsAfterSubscribe(state, action: PayloadAction<any>) {
      state.subscriptions = {
        downloaded: action.payload.downloaded,
        remaining: action.payload.remaining,
        dateStart: action.payload.dateStart,
        dateEnd: action.payload?.dateEnd,
        packageName: action.payload?.packageName,
        labelsIncluded: action.payload?.labelsIncluded,
      };
    },

    updateSubscriptionsAfterBuyTrack(state) {
      state.subscriptions = {
        ...state.subscriptions,
        downloaded: Number(state.subscriptions?.downloaded || 0) + 1,
        remaining: Number(state.subscriptions?.remaining || 1) - 1,
      };
    },
  },
});

export const { actions } = slice;

export const useSubscriptionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: subscriptionsSaga });
  return { actions: slice.actions };
};
