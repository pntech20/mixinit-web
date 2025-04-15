import { lazyLoad } from 'utils/loadable';

export const ReleaseDetailPage = lazyLoad(
  () => import('./index'),
  module => module.ReleaseDetail,
);
