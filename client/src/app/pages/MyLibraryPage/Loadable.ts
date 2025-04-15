import { lazyLoad } from 'utils/loadable';

export const MyLibraryPage = lazyLoad(
  () => import('./index'),
  module => module.MyLibraryPage,
);
