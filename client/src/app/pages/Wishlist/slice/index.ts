import { PayloadAction, current } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { wishlistsSaga } from './saga';
import {
  AddTrackToMyWishlistPayload,
  RemoveTrackToMyWishlistPayload,
  WishlistState,
} from './types';

export const initialState: WishlistState = {
  error: null,
  myWishlists: [],
  isAddedTracksOrRelease: false,
  isCheckOpenModelAddTrackToCart: false,
  addedTrackIdOrReleaseId: null,
  isLoadingWishlist: false,
};

const slice = createSlice({
  name: 'wishlists',
  initialState,
  reducers: {
    getWishlistRequest(state) {
      // state.myWishlists = [];
      const currentWishlists = current(state.myWishlists);
      if (currentWishlists.length === 0) {
        state.myWishlists = []; // Chỉ reset mảng khi nó đang rỗng
      }
      state.isLoadingWishlist = true;
      state.error = null;
    },
    getWishlistSuccess(state, action) {
      state.myWishlists = action.payload;
      state.isLoadingWishlist = false;
    },
    getWishlistFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoadingWishlist = false;
    },

    addTrackToMyWishlistRequest(
      state,
      action: PayloadAction<AddTrackToMyWishlistPayload>,
    ) {
      state.error = null;
      state.isAddedTracksOrRelease = true;
      state.addedTrackIdOrReleaseId = action.payload;
    },
    addTrackToMyWishlistSuccess(state, action) {
      state.myWishlists = [...state.myWishlists, action.payload];
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },
    addTrackToMyWishlistFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },

    addReleaseToMyWishlistRequest(
      state,
      action: PayloadAction<AddTrackToMyWishlistPayload>,
    ) {
      state.error = null;
      state.isAddedTracksOrRelease = true;
      state.addedTrackIdOrReleaseId = action.payload;
    },
    addReleaseToMyWishlistSuccess(state, action) {
      state.myWishlists = [...state.myWishlists, action.payload];
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },
    addReleaseToMyWishlistFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },

    removeTrackToMyWishlistRequest(
      state,
      action: PayloadAction<RemoveTrackToMyWishlistPayload>,
    ) {
      state.error = null;
      state.isAddedTracksOrRelease = true;
      state.addedTrackIdOrReleaseId = action.payload[0];
    },
    removeTrackToMyWishlistSuccess(state, action) {
      const listIds = action.payload.map(i => i._id);
      const { myWishlists } = current(state);
      const filter = [...myWishlists].filter(i => !listIds.includes(i._id));
      state.myWishlists = filter;
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },
    removeTrackToMyWishlistFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },
    updateWishlistsInReducer(state, action) {
      const { trackId } = action.payload;
      const filter = state.myWishlists.filter(wi => wi.track?._id !== trackId);
      state.myWishlists = filter;
    },
    updateTrackandReleaseinWishlistsInReducer(state, action) {
      const trackIds = (action.payload || []).map(i => i?._id);
      const { myWishlists } = current(state);

      const filteredWishlists = myWishlists
        .filter(wishlist => !trackIds.includes(wishlist?.track?._id))
        .map((wishlist: any) => ({
          ...wishlist,
          release:
            wishlist?.type === 'release'
              ? {
                  ...wishlist?.release,
                  tracks: (wishlist?.release?.tracks || []).filter(track => {
                    const boughtByIds = (track?.boughtBy || []).map(
                      user => user?._id,
                    );
                    return !boughtByIds.includes(wishlist?.user?._id);
                  }),
                }
              : undefined,
        }))
        .filter((b: any) => {
          return b?.release?.tracks
            ? !(b?.release?.tracks || []).every(t => trackIds.includes(t?._id))
            : true;
        });

      state.myWishlists = filteredWishlists;
    },
    updateManyWishlistsInReducer(state, action) {
      const unBuyTracks = action.payload;
      var filter = state.myWishlists.filter(obj1 => {
        return unBuyTracks.every(obj2 => {
          return (
            JSON.stringify(obj1.track?.previewUrl) !==
            JSON.stringify(obj2.previewUrl)
          );
        });
      });
      state.myWishlists = filter;
    },
    clearWishlistsInReducer(state) {
      state.myWishlists = [];
    },
    removeReleaseToMyWishlistRequest(
      state,
      action: PayloadAction<RemoveTrackToMyWishlistPayload>,
    ) {
      state.error = null;
      state.isAddedTracksOrRelease = true;
      state.addedTrackIdOrReleaseId = action.payload[0];
    },
    removeReleaseToMyWishlistSuccess(state, action) {
      const listIds = action.payload.map(i => i._id);
      const filter = state.myWishlists.filter(i => !listIds.includes(i._id));
      state.myWishlists = filter;
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },
    removeReleaseToMyWishlistFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAddedTracksOrRelease = false;
      state.addedTrackIdOrReleaseId = null;
    },

    checkoutToMyWishlistSuccess(state) {
      state.myWishlists = [];
    },

    setIsCheckOpenModelAddTrackToCart(state, action) {
      state.isCheckOpenModelAddTrackToCart = action.payload;
    },
  },
});

export const { actions } = slice;
export const actionsWishlists = slice.actions;

export const useWishlistsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: wishlistsSaga });
  return { actions: slice.actions };
};
