import { useInitFiltersValue } from 'app/hooks/filters/useInitFiltersValue';
import { useEffect } from 'react';
import GeneralLayout from '../General';

interface GeneralLayoutProps {
  children: any;
}

export default function LoggedComponent({ children }: GeneralLayoutProps) {
  const { onInitFilterValues } = useInitFiltersValue();

  useEffect(() => {
    onInitFilterValues();
  }, [onInitFilterValues]);

  return <GeneralLayout>{children}</GeneralLayout>;
}
