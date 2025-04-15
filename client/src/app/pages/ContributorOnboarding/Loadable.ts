import { lazyLoad } from 'utils/loadable';

export const ContributorOnboarding = lazyLoad(
  () => import('./index'),
  module => module.ContributorOnboarding,
);
