/**
 *
 * Asynchronously loads the component for ContactUsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ContactUsPage = lazyLoad(
  () => import('./index'),
  module => module.ContactUsPage,
);
