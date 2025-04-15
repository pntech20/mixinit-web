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
  onChangeTabTrack?: () => void;
  selectedTabTrack?: boolean;
  dataSale?: any;
  dataSummary?: any;
}

export const TracksTab = memo(
  ({
    selectedTime,
    selectedTabTrack,
    onChangeTabTrack,
    dataSale,
    dataSummary,
  }: Props) => {
    const { isLoading, columnsTracksSalesLog, columnsTrackSummary } =
      useAccounting();
    const { isDarkMode } = useModeTheme();

    let totalDLS = 0;
    let totalEarnings = 0;

    if (dataSummary) {
      for (var i = 0; i < dataSummary.length; i++) {
        totalDLS += dataSummary[i].totalSold;
        totalEarnings += dataSummary[i].totalEarned;
      }
    }

    return (
      <Box>
        <Box className={styles.box}>
          {isLoading ? (
            renderTable(5)
          ) : (
            <Box>
              <Flex alignItems="center" justify="flex-end" padding="10px 0px">
                <Box ml="auto" textAlign="end">
                  <Box
                    className={styles.title}
                    color={isDarkMode ? '#ffffff' : '#333333'}
                    mb="5px"
                  >
                    Total Track DL's This Period: {totalDLS}
                  </Box>
                  <Box
                    className={styles.title}
                    color={isDarkMode ? '#ffffff' : '#333333'}
                  >
                    Total Track Earnings This Period:
                    {formatMoney(totalEarnings)}
                  </Box>
                </Box>
              </Flex>

              <Flex alignItems="center">
                <Box
                  className={styles.tab}
                  bg={!selectedTabTrack ? '#C20100' : 'none'}
                  mr="2px"
                  color={!selectedTabTrack || isDarkMode ? '#FFF' : '#000'}
                  onClick={onChangeTabTrack}
                >
                  Sales Log
                </Box>
                <Box
                  className={styles.tab}
                  bg={selectedTabTrack ? '#C20100' : 'none'}
                  color={selectedTabTrack || isDarkMode ? '#FFF' : '#000'}
                  onClick={onChangeTabTrack}
                >
                  Track Summary
                </Box>
              </Flex>

              {!selectedTabTrack ? (
                <CommonTable
                  columns={columnsTracksSalesLog}
                  data={dataSale}
                  isColorHeader
                  isNotIndex
                />
              ) : (
                <CommonTable
                  columns={columnsTrackSummary}
                  data={dataSummary}
                  isColorHeader
                />
              )}
            </Box>
          )}
        </Box>
        {/* <LabelTracksV1 /> */}
      </Box>
    );
  },
);
