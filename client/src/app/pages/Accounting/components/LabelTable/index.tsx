import { Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { AccountingLabelItem } from '../../slice/types';
import CommonTable from '../CommonTable';
import styles from './index.module.scss';
import classnames from 'classnames';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useSelector } from 'react-redux';

interface Props {
  isLoading?: boolean;
  labels: AccountingLabelItem[];
}

function LabelTable(props: Props) {
  const { userDetail } = useSelector(selectAuth);
  const { isLoading, labels } = props;
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
        Header: 'Quota',
        accessor: 'Quota',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.quota ?? 0;
        },
      },
      {
        Header: 'Uploaded',
        accessor: 'uploads',
        Cell: ({
          cell: {
            row: { original, index },
          },
        }) => {
          const { metQuota, uploads = 0 } = original;
          return (
            <Text
              className={classnames(styles.uploadTxt, {
                [styles.uploadValidTxt]: metQuota,
              })}
            >
              {uploads}
            </Text>
          );
        },
      },
      {
        Header: 'Max',
        accessor: 'maxUpload',
        Cell: ({
          cell: {
            row: { original, index },
          },
        }) => {
          return original?.maxUpload ?? 'N/A';
        },
      },
      {
        Header: 'Tracks Sold',
        accessor: 'tracksSold',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.tracksSold ?? 'N/A';
        },
      },
      {
        Header: 'Gross Tokens',
        accessor: 'grossTokens',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.tokenGross ?? 'N/A';
        },
      },
      {
        Header: 'Split (%)',
        accessor: 'split',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return `${original?.split ?? 0}%`;
        },
      },
      {
        Header: 'Net Tokens',
        accessor: 'netTokens',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.yourCut ?? 'N/A';
        },
      },
      {
        Header: 'Payout',
        accessor: 'payout',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          const { yourCut } = original;
          return yourCut
            ? `$${(
                Math.round(yourCut * userDetail?.tokenValue * 100) / 100
              ).toFixed(2)}`
            : 'N/A';
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          const { metQuota } = original;
          return (
            <Text
              className={classnames(styles.status, {
                [styles.statusMetQuota]: metQuota,
              })}
            >
              {metQuota ? 'ACTIVE' : 'NO QUOTA'}
            </Text>
          );
        },
      },
    ],
    [userDetail?.tokenValue],
  );

  return (
    <>
      {isLoading ? (
        'Loading ...'
      ) : (
        <CommonTable columns={columns} data={labels} />
      )}
    </>
  );
}

export default LabelTable;
