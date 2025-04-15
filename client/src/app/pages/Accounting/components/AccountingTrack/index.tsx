import { memo, useMemo } from 'react';
import { AccountingTrackItem } from '../../slice/types';
import CommonTable from '../CommonTable';

interface Props {
  isLoading?: boolean;
  topTracks: AccountingTrackItem[];
}

export const AccountingTrack = memo((props: Props) => {
  const { isLoading, topTracks } = props;

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
          return original?.track?.title;
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
        <CommonTable columns={columns} data={topTracks} />
      )}
    </>
  );
});
