/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Top100Page = lazyLoad(
  () => import('./index'),
  module => module.Top100Page,
);
