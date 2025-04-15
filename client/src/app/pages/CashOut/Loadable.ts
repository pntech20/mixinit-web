import { lazyLoad } from 'utils/loadable';

export const CashOutPage = lazyLoad(
  () => import('./index'),
  module => module.CashOutPage,
);
