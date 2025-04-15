import { lazyLoad } from 'utils/loadable';

export const AccountingTrack = lazyLoad(
  () => import('./index'),
  module => module.AccountingTrack,
);
