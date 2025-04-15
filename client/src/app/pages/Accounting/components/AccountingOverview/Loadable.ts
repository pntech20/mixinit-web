import { lazyLoad } from 'utils/loadable';

export const AccountingOverview = lazyLoad(
  () => import('./index'),
  module => module.AccountingOverview,
);
