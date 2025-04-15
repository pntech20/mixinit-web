import { lazyLoad } from 'utils/loadable';

export const SubscriptionForm = lazyLoad(
  () => import('./index'),
  module => module.SubscriptionForm,
);
