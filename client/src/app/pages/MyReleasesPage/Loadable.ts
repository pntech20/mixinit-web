import { lazyLoad } from 'utils/loadable';

export const MyReleasesPage = lazyLoad(
  () => import('./index'),
  module => module.MyReleasesPage,
);
