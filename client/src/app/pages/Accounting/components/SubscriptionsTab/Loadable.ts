import { lazyLoad } from 'utils/loadable';

export const SubscriptionsTab = lazyLoad(
  () => import('./index'),
  module => module.SubscriptionsTab,
);
