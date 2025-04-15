import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Banner } from 'app/components/Banner';
import { HelmetPage } from 'app/components/HelmetPage';
import InputSearch from 'app/components/InputSearch';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import CommonTable from '../Accounting/components/CommonTable';
import { useEffect, useMemo } from 'react';
import { formatDate } from 'utils/date';
import { useOrder } from 'app/hooks/order/useOrder';
import { renderTable } from 'app/components/TrackUtils/track';
import { CSVLink } from 'react-csv';
import { formatMoney } from 'app/utils/currency';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';

export function MyTransactionsPage() {
  const { isSmallerThan768, isLargerThan992 } = useMediaScreen();

  const {
    getDataOrder,
    dataOrder,
    handleOnchangeSearch,
    searchValue,
    isLoading,
  } = useOrder();

  useEffect(() => {
    getDataOrder();
  }, [getDataOrder]);

  const columnsOverview = useMemo(
    () => [
      {
        Header: 'DATE',
        accessor: 'createdAt',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatDate(original?.createdAt);
        },
      },
      {
        Header: 'ORDER',
        accessor: 'orderId',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.orderId;
        },
      },
      {
        Header: 'TRACKS',
        accessor: 'tracks.length',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            <Box>{original?.tracks.length > 0 && original?.tracks.length}</Box>
          );
        },
      },
      {
        Header: 'T-DC%',
        accessor: 'trackDiscount',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            original?.tracks.length > 0 && `${original?.trackDiscount}% OFF`
          );
        },
      },
      {
        Header: 'T-COST',
        accessor: 'trackCost',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            original?.tracks.length > 0 && formatMoney(original?.trackCost)
          );
        },
      },
      {
        Header: 'MULTIPACKS',
        accessor: 'releases.length',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            <Box>
              {original?.releases.length > 0 && original?.releases.length}
            </Box>
          );
        },
      },
      {
        Header: 'M-DC%',
        accessor: 'releaseDiscount',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            original?.releases.length > 0 && `${original?.releaseDiscount}% OFF`
          );
        },
      },
      {
        Header: 'M-COST',
        accessor: 'releaseCost',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            original?.releases.length > 0 && formatMoney(original?.releaseCost)
          );
        },
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return (
            <Box
              color={original?.status === 'COMPLETED' ? '#000' : '#fff'}
              bg={original?.status === 'COMPLETED' ? '#59ff00' : 'red'}
              p="5px"
              borderRadius="5px"
              fontSize={12}
              fontWeight={600}
              w="max"
            >
              {original?.status}
            </Box>
          );
        },
      },
      {
        Header: 'TOTAL COST',
        accessor: 'totalCost',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.totalCost);
        },
      },
      {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            <Button
              bg="#EDF2F7"
              color="#1A202C"
              padding="0px 15px"
              fontSize="14px"
            >
              Detail
            </Button>
          </span>
        ),
      },
    ],
    [],
  );

  const headers = useMemo(() => {
    const filter = columnsOverview
      .filter(col => col?.accessor)
      .map(i => ({
        label: i.Header,
        key: i.accessor,
      }));
    return filter;
  }, [columnsOverview]);

  const csvReport = {
    data: dataOrder,
    headers,
    filename: 'My_Transactions.csv',
  };

  return (
    <Box>
      <HelmetPage title="Tracks Purchased" />
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      <Banner />
      <Box my="25px">
        <Text
          fontWeight="bolder"
          fontSize={!isSmallerThan768 ? '38px' : '24px'}
          lineHeight="44px"
        >
          My Transactions
        </Text>

        <Text
          mt="5px"
          fontSize={!isSmallerThan768 ? '18px' : '16px'}
          fontWeight="600"
        >
          Here you can view and download a csv of all your transactions with us.
        </Text>

        <Flex alignItems="end">
          <Box w="100%" mt="10px">
            <InputSearch
              value={searchValue}
              onChange={e => handleOnchangeSearch(e)}
              placeholder="Search ..."
            />
          </Box>
          <CSVLink {...csvReport}>
            <Flex
              ml="8px"
              alignItems="center"
              borderRadius="5px"
              justifyContent="center"
              w="60px"
              h="38px"
              bg="#c20300"
              border="5px"
              _hover={{ cursor: 'pointer' }}
            >
              <Text fontWeight="700" color="#fff">
                CSV
              </Text>
            </Flex>
          </CSVLink>
        </Flex>

        <Box mt="20px">
          {isLoading ? (
            renderTable(5)
          ) : (
            <CommonTable
              columns={columnsOverview}
              data={dataOrder || []}
              isColorHeaderBlack
              isNotIndex
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
