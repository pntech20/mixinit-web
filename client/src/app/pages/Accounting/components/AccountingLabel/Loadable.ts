import { lazyLoad } from 'utils/loadable';

export const AccountingLabel = lazyLoad(
  () => import('./index'),
  module => module.AccountingLabel,
);
