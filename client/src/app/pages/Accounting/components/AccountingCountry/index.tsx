import { memo, useMemo } from 'react';
import { AccountingCountryItem } from '../../slice/types';
import CommonTable from '../CommonTable';

interface Props {
  isLoading?: boolean;
  topCountries: AccountingCountryItem[];
}

export const AccountingCountry = memo((props: Props) => {
  const { isLoading, topCountries } = props;
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'country',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original.country;
        },
      },
    ],
    [],
  );

  return (
    <>
      {isLoading ? (
        'Loading ...'
      ) : (
        <CommonTable columns={columns} data={topCountries} />
      )}
    </>
  );
});
