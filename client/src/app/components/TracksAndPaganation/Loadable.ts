/**
 *
 * Asynchronously loads the component for MyPlaylist
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TracksAndPagination = lazyLoad(
  () => import('./index'),
  module => module.TracksAndPagination,
);
