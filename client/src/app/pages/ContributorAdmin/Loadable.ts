import { lazyLoad } from 'utils/loadable';

export const ContributorAdminPage = lazyLoad(
  () => import('./index'),
  module => module.ContributorAdminPage,
);
