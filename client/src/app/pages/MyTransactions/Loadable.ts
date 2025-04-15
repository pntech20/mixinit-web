import { lazyLoad } from 'utils/loadable';

export const MyTransactionsPage = lazyLoad(
  () => import('./index'),
  module => module.MyTransactionsPage,
);
