import { lazyLoad } from 'utils/loadable';

export const LabelsPage = lazyLoad(
  () => import('./index'),
  module => module.LabelsPage,
);
