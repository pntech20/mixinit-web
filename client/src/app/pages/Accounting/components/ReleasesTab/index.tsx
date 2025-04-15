import { Box, Flex } from '@chakra-ui/react';
import { renderTable } from 'app/components/TrackUtils/track';
import { useAccounting } from 'app/hooks/accounting/useAccounting';
import { memo } from 'react';
import CommonTable from '../CommonTable';
import styles from './index.module.scss';
import { formatMoney } from 'app/utils/currency';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';

interface Props {
  selectedTime?: string;
  onChangeTabReleases?: () => void;
  selectedTabReleases?: boolean;
  dataSale?: any;
  dataSummary?: any;
}

export const ReleasesTab = memo(
  ({
    selectedTime,
    selectedTabReleases,
    onChangeTabReleases,
    dataSale,
    dataSummary,
  }: Props) => {
    const { isDarkMode } = useModeTheme();
    const { isLoading, columnsReleasesSalesLog, columnsReleasesSummary } =
      useAccounting();

    let totalDLS = 0;
    let totalEarnings = 0;

    if (dataSummary) {
      for (var i = 0; i < dataSummary.length; i++) {
        totalDLS += dataSummary[i].totalSold;
        totalEarnings += dataSummary[i].totalEarned;
      }
    }

    return (
      <Box className={styles.box}>
        {isLoading ? (
          renderTable(5)
        ) : (
          <Box>
            <Flex alignItems="center" justify="flex-end" padding="10px 0px">
              <Box ml="auto" textAlign="end">
                <Box
                  className={styles.title}
                  color={isDarkMode ? '#FFF' : '#333'}
                  mb="5px"
                >
                  Total Multipack DL's This Period: {totalDLS}
                </Box>
                <Box
                  className={styles.title}
                  color={isDarkMode ? '#FFF' : '#333'}
                >
                  Total Multipack Earnings This Period:
                  {formatMoney(totalEarnings)}
                </Box>
              </Box>
            </Flex>

            <Flex alignItems="center">
              <Box
                className={styles.tab}
                bg={!selectedTabReleases ? '#C20100' : 'none'}
                mr="2px"
                color={!selectedTabReleases || isDarkMode ? '#FFF' : '#000'}
                onClick={onChangeTabReleases}
              >
                Sales Log
              </Box>
              <Box
                className={styles.tab}
                bg={selectedTabReleases ? '#C20100' : 'none'}
                color={selectedTabReleases || isDarkMode ? '#FFF' : '#000'}
                onClick={onChangeTabReleases}
              >
                Multipack Summary
              </Box>
            </Flex>

            {!selectedTabReleases ? (
              <CommonTable
                columns={columnsReleasesSalesLog}
                data={dataSale}
                isColorHeader
                isNotIndex
              />
            ) : (
              <CommonTable
                columns={columnsReleasesSummary}
                data={dataSummary}
                isColorHeader
              />
            )}
          </Box>
        )}
      </Box>
    );
  },
);
