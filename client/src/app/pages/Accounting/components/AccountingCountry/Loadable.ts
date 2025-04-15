import { lazyLoad } from 'utils/loadable';

export const AccountingCountry = lazyLoad(
  () => import('./index'),
  module => module.AccountingCountry,
);
