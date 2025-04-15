import { Box, Flex } from '@chakra-ui/react';
import { renderTable } from 'app/components/TrackUtils/track';
import { useAccounting } from 'app/hooks/accounting/useAccounting';
import { memo } from 'react';
import CommonTable from '../CommonTable';
import styles from './index.module.scss';
import { formatMoney } from 'app/utils/currency';

interface Props {
  selectedTime?: string;
  dataSale?: any;
  dataSummary?: any;
}

export const SubscriptionsTab = memo(
  ({ selectedTime, dataSale, dataSummary }: Props) => {
    const labels = new Set();
    let totalDLS = 0;
    let totalEarnings = 0;

    dataSale?.forEach(item => {
      const label = item.accounting.label;
      if (!labels.has(label)) {
        labels.add(label);
        totalDLS += +item.accounting.numberSubscriptions || 0;
        totalEarnings +=
          (+item.accounting?.numberSubscriptions || 0) *
          (+item.accounting?.perDownloadValue || 0);
      }
    });

    const { isLoading, columnsSubscriptions } = useAccounting();

    return (
      <Box className={styles.box}>
        {isLoading ? (
          renderTable(5)
        ) : (
          <Box>
            <Flex alignItems="center" justify="flex-end" padding="10px 0px">
              <Box ml="auto" textAlign="end">
                <Box className={styles.title} mb="5px">
                  Total Subscriptions DL's This Period: {totalDLS}
                </Box>
                <Box className={styles.title}>
                  Total Subscriptions Earnings This Period:
                  {formatMoney(totalEarnings)}
                </Box>
              </Box>
            </Flex>
            <CommonTable
              columns={columnsSubscriptions}
              data={dataSale}
              isColorHeader
              isNotIndex
            />
          </Box>
        )}
      </Box>
    );
  },
);
