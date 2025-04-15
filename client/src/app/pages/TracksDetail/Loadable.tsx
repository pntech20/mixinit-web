import { lazyLoad } from 'utils/loadable';

export const TrackDetailPage = lazyLoad(
  () => import('./index'),
  module => module.TrackDetail,
);
