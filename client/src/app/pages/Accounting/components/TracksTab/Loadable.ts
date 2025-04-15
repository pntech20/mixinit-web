import { lazyLoad } from 'utils/loadable';

export const TracksTab = lazyLoad(
  () => import('./index'),
  module => module.TracksTab,
);
