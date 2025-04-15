import { lazyLoad } from 'utils/loadable';

export const CompleteOrder = lazyLoad(
  () => import('./index'),
  module => module.CompleteOrder,
);
