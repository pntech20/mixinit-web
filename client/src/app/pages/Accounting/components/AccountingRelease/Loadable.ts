import { lazyLoad } from 'utils/loadable';

export const AccountingRelease = lazyLoad(
  () => import('./index'),
  module => module.AccountingRelease,
);
