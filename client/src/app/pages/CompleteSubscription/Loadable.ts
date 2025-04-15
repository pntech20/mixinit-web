import { lazyLoad } from 'utils/loadable';

export const CompleteSubscription = lazyLoad(
  () => import('./index'),
  module => module.CompleteSubscription,
);
