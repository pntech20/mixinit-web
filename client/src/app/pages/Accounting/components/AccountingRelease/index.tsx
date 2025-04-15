import { memo, useMemo } from 'react';
import { AccountingReleaseItem } from '../../slice/types';
import CommonTable from '../CommonTable';

interface Props {
  isLoading?: boolean;
  topReleases: AccountingReleaseItem[];
}

export const AccountingRelease = memo((props: Props) => {
  const { isLoading, topReleases } = props;
  const columns = useMemo(
    () => [
      {
        Header: 'Release',
        accessor: 'title',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original.release.title;
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
          return original?.totalPayeeReceive ?? 'N/A';
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
        <CommonTable columns={columns} data={topReleases} />
      )}
    </>
  );
});
