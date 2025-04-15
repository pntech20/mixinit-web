import { lazyLoad } from 'utils/loadable';

export const AdsPage = lazyLoad(
  () => import('./index'),
  module => module.AdsPage,
);
