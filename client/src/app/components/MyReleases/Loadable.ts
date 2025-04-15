/**
 *
 * Asynchronously loads the component for MyPlaylist
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MyReleases = lazyLoad(
  () => import('./index'),
  module => module.MyReleases,
);
