import { Box, Button, Image, Text } from '@chakra-ui/react';
import { formatDate } from 'app/utils/date';
import { memo, useMemo } from 'react';
import './labelOverviewItem.scss';
import { formatMoney } from 'app/utils/currency';
import dayjs from 'dayjs';

interface Props {
  labelOverviewItem: any;
  subscriptionPool: any;
  startTime?: any;
  endTime?: any;
}

export const LabelOverviewItem = memo(
  ({ labelOverviewItem, subscriptionPool, startTime, endTime }: Props) => {
    const {
      label: { squareImageUrl },
      tracksSold,
      numberSubscriptions = 0,
      isAlreadyPayout = false,
      dayPaid,
      paypalEmailPaid,
      metQuota,
      trackEarnings,
      releasesSold,
      releaseEarnings,
      name,
      startDate,
      endDate,
      perDownloadValue,
    } = labelOverviewItem;

    const subscriptionEarnings = useMemo(() => {
      return ((perDownloadValue || 0) * numberSubscriptions).toFixed(2);
    }, [numberSubscriptions, perDownloadValue]);

    const totalEarnings = (
      +releaseEarnings +
      +trackEarnings +
      +subscriptionEarnings
    ).toFixed(2);

    return (
      <Box className="row-inner">
        <Box>
          <Image w="100%" borderRadius="5px" src={squareImageUrl} />
        </Box>
        <Text fontSize="18px" mt="5px">
          {name}
        </Text>
        <Text fontSize="14px">
          ({formatDate(startDate)} -{' '}
          {dayjs(endDate).subtract(1, 'days').format('MM/DD/YYYY')})
        </Text>
        <Box mt="10px">
          <Text>Tracks Sold:</Text>
          <Text className="value-label-overview">{tracksSold || 0}</Text>
        </Box>
        <Box mt="10px">
          <Text>Track Earnings</Text>
          <Text className="value-label-overview">
            {formatMoney(trackEarnings)}
          </Text>
        </Box>
        <Box mt="10px">
          <Text>Multipacks Sold:</Text>
          <Text className="value-label-overview">{releasesSold}</Text>
        </Box>
        <Box mt="10px">
          <Text>Multipack Earnings:</Text>
          <Text className="value-label-overview">
            {formatMoney(releaseEarnings)}
          </Text>
        </Box>
        <Box mt="10px">
          <Text>Subscriber Downloads:</Text>
          <Text className="value-label-overview">{numberSubscriptions}</Text>
        </Box>
        <Box mt="10px">
          <Text>Subscription Earnings:</Text>
          <Text className="value-label-overview">
            {formatMoney(+subscriptionEarnings)}
          </Text>
        </Box>
        {/* <Box mt="10px">
          <Text>Total Downloads:</Text>
          <Text className="value-label-overview">
            {subscriptionPool?.totalSubscriptionBasedDownloads}
          </Text>
        </Box> */}
        <Box className="divider" />
        <Box mt="10px">
          <Text>Total Earnings:</Text>
          <Text className="value-label-overview">
            {formatMoney(+totalEarnings)}
          </Text>
        </Box>
        <Box className="divider" />
        <Box mt="10px">
          <Text>Status:</Text>
          <Button
            cursor="auto"
            backgroundColor={isAlreadyPayout ? '#38ec50' : 'grey'}
            fontSize="14px"
            mt="5px"
          >
            {!metQuota ? 'No Quota' : isAlreadyPayout ? 'Paid' : 'Not Paid'}
          </Button>
        </Box>
        {isAlreadyPayout && (
          <>
            <Box mt="10px">
              <Text>Paid Date:</Text>
              <Text className="value-label-overview">
                {formatDate(dayPaid)}
              </Text>
            </Box>
            <Box mt="10px" mb="10px">
              <Text>Paid To:</Text>
              <Text className="value-label-overview">{paypalEmailPaid}</Text>
            </Box>
          </>
        )}
      </Box>
    );
  },
);
