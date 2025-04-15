import { createContext } from 'react';

export const PageHeaderContext = createContext<{
  pageHeader: null;
}>({
  pageHeader: null,
});
