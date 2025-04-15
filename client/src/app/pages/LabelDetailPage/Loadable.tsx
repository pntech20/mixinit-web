/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const LabelDetailPage = lazyLoad(
  () => import('./index'),
  module => module.LabelDetailPage,
);
