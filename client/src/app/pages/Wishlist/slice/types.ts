import { Nullable } from 'app/constants/types';
import { Wishlist } from 'app/models';

/* --- STATE --- */
export interface WishlistState {
  error: Nullable<Error | string>;
  myWishlists: Wishlist[];
  isAddedTracksOrRelease: boolean;
  isCheckOpenModelAddTrackToCart: boolean;
  addedTrackIdOrReleaseId: any;
  isLoadingWishlist?: boolean;
}

export interface WishlistsResponse {
  data: Array<Wishlist>;
}

export interface AddTrackToMyWishlistPayload {
  trackId: string;
}

export interface RemoveTrackToMyWishlistPayload {
  trackIds: string[];
}
