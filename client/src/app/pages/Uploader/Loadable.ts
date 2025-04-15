import { lazyLoad } from 'utils/loadable';

export const UploaderPage = lazyLoad(
  () => import('./index'),
  module => module.Uploader,
);
