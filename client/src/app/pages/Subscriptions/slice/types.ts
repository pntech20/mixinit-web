import { Nullable } from 'app/constants/types';

export interface SubscriptionsState {
  subscriptions?: Nullable<{
    downloaded?: number;
    remaining?: number;
    dateStart?: string;
    dateEnd?: string;
    packageName?: string;
    labelsIncluded?: string[];
  }>;
}
