import { lazyLoad } from 'utils/loadable';

export const ReleasesTab = lazyLoad(
  () => import('./index'),
  module => module.ReleasesTab,
);
