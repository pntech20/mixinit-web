/**
 *
 * Asynchronously loads the component for MyPlaylist
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ReleasesAndPagination = lazyLoad(
  () => import('./index'),
  module => module.ReleasesAndPagination,
);
