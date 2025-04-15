import {
  Box,
  chakra,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { FaSortAmountDownAlt, FaSortAmountUp } from 'react-icons/fa';
import { RiArrowUpDownFill } from 'react-icons/ri';
import { useExpanded, useSortBy, useTable } from 'react-table';
import styles from './index.module.scss';
import { useHistory } from 'react-router-dom';
import { formatTitle } from 'app/utils/formatTitleTrack';

interface Props {
  columns: any;
  data: any;
  isColorHeader?: boolean;
  isColorHeaderBlack?: boolean;
  isNotIndex?: boolean;
}

export default function CommonTable(props: Props) {
  const {
    columns,
    data = [],
    isColorHeader = false,
    isNotIndex = false,
    isColorHeaderBlack = false,
  } = props;
  const history = useHistory();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns, data }, useSortBy, useExpanded);
  const { isDarkMode } = useModeTheme();

  const renderSortDirectionIcon = useCallback(column => {
    const { accessor, isSorted, isSortedDesc } = column;

    if (!accessor) return;
    if (!isSorted) return <RiArrowUpDownFill />;
    if (isSortedDesc) return <FaSortAmountDownAlt />;

    return <FaSortAmountUp />;
  }, []);

  const renderHeader = () => {
    return headerGroups.map((headerGroup, i) => (
      <Tr
        key={i}
        {...headerGroup.getHeaderGroupProps()}
        bg={isColorHeader ? '#c20300' : isColorHeaderBlack && '#000'}
      >
        <Th
          color={
            isDarkMode
              ? '#FFFFFF'
              : isColorHeader || isColorHeaderBlack
              ? '#FFFFFF'
              : '#000000'
          }
          display={isNotIndex ? 'none' : 'table-cell'}
        >
          #
        </Th>
        {headerGroup.headers.map((column, col) => (
          <Th
            key={col}
            {...column.getHeaderProps(column.getSortByToggleProps())}
            isNumeric={column.isNumeric}
            className={styles.headerTable}
            color={
              isDarkMode
                ? '#FFFFFF'
                : isColorHeader || isColorHeaderBlack
                ? '#FFFFFF'
                : '#000000'
            }
          >
            <Flex alignItems="center">
              {column.render('Header')}
              <chakra.span pl="5px">
                {renderSortDirectionIcon(column)}
              </chakra.span>
            </Flex>
          </Th>
        ))}
      </Tr>
    ));
  };

  const renderBody = () => {
    if (data.length === 0) {
      return (
        <Tr>
          <Td colSpan={columns.length + 1}>
            <Empty />
          </Td>
        </Tr>
      );
    }

    return rows.map((row, index) => {
      prepareRow(row);

      return (
        <React.Fragment key={index}>
          <Tr {...row.getRowProps()}>
            <Td display={isNotIndex ? 'none' : 'table-cell'}>{index + 1}</Td>
            {row.cells.map((cell, idx) => (
              <Td
                key={idx}
                {...cell.getCellProps()}
                isNumeric={cell.column.isNumeric}
                className={classNames(styles.text, styles.cellTable)}
              >
                <Box>{cell.render('Cell')}</Box>
              </Td>
            ))}
          </Tr>
          {row.isExpanded ? (
            <tr>
              <td colSpan={visibleColumns.length}>
                {renderRowSubComponent({ row })}
              </td>
            </tr>
          ) : null}
        </React.Fragment>
      );
    });
  };

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      return (
        <Box ml="20px" mt="10px">
          {row.original?.tracks?.length > 0 && (
            <>
              <Text fontWeight={900} fontSize="16px">
                TRACKS
              </Text>
              {row.original?.tracks?.map((track, index) => (
                <Box key={track._id} mt="10px">
                  <Flex alignContent="center" alignItems="center" gridGap="5px">
                    <Text fontWeight={600} mr="10px">
                      {index + 1}
                    </Text>
                    <Box mr="5px">
                      <img
                        src={track.artwork}
                        alt="Track thumbnail"
                        width="50px"
                        height="50px"
                      />
                    </Box>
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight={500}
                        cursor="pointer"
                        _hover={{ cursor: 'pointer', color: 'blue' }}
                        onClick={() => history.push(`/tracks/${track?.slug}`)}
                      >
                        {track.title ? formatTitle(track.title) : ''}
                      </Text>
                      <Text fontSize="14px" fontStyle="italic" fontWeight={500}>
                        {track.artist ? formatTitle(track.artist) : ''}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </>
          )}
          {row.original?.releases?.length > 0 && (
            <>
              <Text fontWeight={900} fontSize="16px" mt="15px">
                MULTIPACKS
              </Text>{' '}
              {row.original?.releases?.map((release, index) => (
                <Box key={release._id} mt="10px">
                  <Flex alignContent="center" alignItems="center" gridGap="5px">
                    <Text fontWeight={600} mr="10px">
                      {index + 1}
                    </Text>
                    <Box mr="5px">
                      <img
                        src={release.artwork}
                        alt="Track thumbnail"
                        width="50px"
                        height="50px"
                      />
                    </Box>
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight={500}
                        cursor="pointer"
                        _hover={{ cursor: 'pointer', color: 'blue' }}
                        onClick={() =>
                          history.push(`/multipacks/${release?.slug}`)
                        }
                      >
                        {release.title}
                      </Text>
                      <Text fontSize="14px" fontStyle="italic" fontWeight={500}>
                        {release.tracks?.length} tracks
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </>
          )}
        </Box>
      );
    },
    [history],
  );

  return (
    <TableContainer>
      <Table
        w="100%"
        {...getTableProps()}
        renderRowSubComponent={renderRowSubComponent}
      >
        <Thead>{renderHeader()}</Thead>
        <Tbody {...getTableBodyProps()}>{renderBody()}</Tbody>
      </Table>
    </TableContainer>
  );
}
