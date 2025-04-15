import { Nullable } from 'app/constants/types';
import { SubcriptionTier, Token, Storage } from 'app/models';

/* --- STATE --- */
export interface ServicesState {
  error: Nullable<Error | string>;
  tokenPackages: Array<Token>;
  tiers: Array<SubcriptionTier>;
  storagePlans: Array<Storage>;
  currentTierId?: Nullable<string>;
  currentStorageId: string | null | undefined;
  isLoading: boolean;
  isUnSubscribeSuccess: boolean;
}

export interface GetSubcriptionTiersPayload {}
export interface GetSubscriptionTiersResponse {
  data: SubcriptionTier[];
}

export interface GetStoragePlansPayload {}
export interface GetStoragePlansResponse {
  data: Storage[];
}

export interface TokensFilter {
  sort?: string;
}

export interface GetTokenPackagesPayload {}
export interface GetTokenPackagesResponse {
  data: Token[];
}

export interface BuyTokenPackagePayload {
  packageId?: string;
  ipAddress?: string;
  country?: string;
  subscriptionID?: string;
}

export interface UnSribeSubscriptionPayload {
  packageId?: string;
}

export interface BuyTokenPackageResponse {
  data: {
    tokensRemaining: number;
    starsRemaining: number;
    slotsRemaining: number;
  };
}

export interface SubscribeTierPlayload {
  tierId?: string;
  paypalOrderId?: string;
  paypalTierSubscriptionId?: string;
}

export interface SubscribeTierResponse {
  paypalTierSubscriptionId: string;
  tierId: string;
}

export interface UnsubscribeTierResponse {
  tier: SubcriptionTier;
  paypalTierSubscriptionId: Nullable<string>;
}

export interface SubscribeStoragePlayload {
  storageId?: string;
  paypalOrderId?: string;
  paypalStorageSubscriptionId?: string;
}

export interface SubscribeStorageResponse {
  storageId: string;
  paypalStorageSubscriptionId: string;
}
export interface UnsubscribeStorageResponse {
  storage: Nullable<Storage>;
  paypalStorageSubscriptionId: Nullable<string>;
}
