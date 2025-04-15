/**
 *
 * Asynchronously loads the component for AccountSettingsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AccountSettingsPage = lazyLoad(
  () => import('./index'),
  module => module.AccountSettingsPage,
);
