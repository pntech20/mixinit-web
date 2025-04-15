import { lazyLoad } from 'utils/loadable';

export const TracksPage = lazyLoad(
  () => import('./index'),
  module => module.Tracks,
);
