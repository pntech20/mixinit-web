/**
 * Asynchronously loads the component for ChartsPage
 */

import { lazyLoad } from 'utils/loadable';

export const ChartsPage = lazyLoad(
  () => import('./index'),
  module => module.ChartsPage,
);
