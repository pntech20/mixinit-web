import { lazyLoad } from 'utils/loadable';

export const ReleaseEditor = lazyLoad(
  () => import('./index'),
  module => module.ReleaseEditor,
);
