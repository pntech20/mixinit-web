/**
 * Asynchronously loads the component for HowToGuidesPage
 */

import { lazyLoad } from 'utils/loadable';

export const HowToGuidesPage = lazyLoad(
  () => import('./index'),
  module => module.HowToGuidesPage,
);
