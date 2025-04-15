/**
 *
 * Asynchronously loads the component for Releases
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Releases = lazyLoad(
  () => import('./index'),
  module => module.ReleasesPage,
);
