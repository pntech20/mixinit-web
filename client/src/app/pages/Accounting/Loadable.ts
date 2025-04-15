import { lazyLoad } from 'utils/loadable';

export const Accounting = lazyLoad(
  () => import('./index'),
  module => module.Accounting,
);
