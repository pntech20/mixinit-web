import { memo, useMemo } from 'react';
import { AccountingLabelItem } from '../../slice/types';
import CommonTable from '../CommonTable';

interface Props {
  isLoading?: boolean;
  topLabels: AccountingLabelItem[];
}

export const AccountingLabel = memo((props: Props) => {
  const { isLoading, topLabels } = props;
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original.name;
        },
      },
      {
        Header: 'Tokens Earned',
        accessor: 'netTokens',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.yourCut ?? 'N/A';
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
        <CommonTable columns={columns} data={topLabels} />
      )}
    </>
  );
});
