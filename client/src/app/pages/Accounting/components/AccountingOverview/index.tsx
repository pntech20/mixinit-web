import { Box, SimpleGrid } from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import { useLabelAccounting } from 'app/hooks/accounting/useLabelAccounting';
import { memo, useEffect, useState } from 'react';
import { LabelOverviewItem } from './LabelOverviewItem';
import { generateArray } from 'app/helpers/functions';
import SkeletonItem from 'app/components/SkeletonItem';
import CommonTable from '../CommonTable';
import { renderTable } from 'app/components/TrackUtils/track';
import styles from './index.module.scss';
import { useAccounting } from 'app/hooks/accounting/useAccounting';
import useContributorSubscriptionPool from 'app/hooks/services/useContributorSubscriptionPool';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';

interface Props {
  selectedTime?: string;
  selectedLabel?: string;
  dataSale?: any;
  startTime?: any;
  endTime?: any;
}

export const AccountingOverview = memo(
  ({ selectedTime, selectedLabel, dataSale, startTime, endTime }: Props) => {
    const { isDarkMode } = useModeTheme();
    const [data, setData] = useState(dataSale || []);
    useEffect(() => {
      if (dataSale && dataSale.length > 0) {
        const dataNew = dataSale.map(i => ({
          ...i,
          item: i.track ? i.track?.title : i.release?.title,
        }));
        setData(dataNew);
      }
    }, [dataSale]);
    const { columnsOverview } = useAccounting();
    const { subscriptionPool, getSubscriptionPool } =
      useContributorSubscriptionPool();

    const { onGetLabelsAccounting, isLoading, labels } = useLabelAccounting();

    useEffect(() => {
      onGetLabelsAccounting({ startTime, endTime, label: selectedLabel });
    }, [endTime, onGetLabelsAccounting, selectedLabel, startTime]);

    useEffect(() => {
      getSubscriptionPool();
    }, [getSubscriptionPool]);

    const renderLoading = () => (
      <Box mt="15px">
        <SimpleGrid gridGap="15px" columns={{ base: 1, sm: 2, md: 2, xl: 4 }}>
          {generateArray(4).map(item => (
            <SkeletonItem borderRadius="10px" key={item} />
          ))}
        </SimpleGrid>
      </Box>
    );

    return (
      <Box>
        <Box
          className={styles.title}
          color={isDarkMode ? '#ffffff' : '#222222'}
        >
          Breakdown By Label
        </Box>
        {isLoading ? (
          renderLoading()
        ) : !labels?.length ? (
          <Box margin="0 auto" textAlign="center">
            <Empty />
          </Box>
        ) : (
          <SimpleGrid
            mt="30px"
            gridGap="15px"
            columns={{ base: 1, sm: 2, md: 2, xl: 4 }}
          >
            {labels.map(item => (
              <Box key={item._id}>
                <LabelOverviewItem
                  labelOverviewItem={item}
                  subscriptionPool={subscriptionPool}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Box
          className={styles.title}
          color={isDarkMode ? '#ffffff' : '#222222'}
        >
          Recent Sales
        </Box>
        <Box>
          {isLoading ? (
            renderTable(5)
          ) : (
            <CommonTable
              columns={columnsOverview}
              data={data}
              isColorHeader
              isNotIndex
            />
          )}
        </Box>
      </Box>
      // <div className={styles.container}>
      //   <Text fontSize="16px" fontWeight="600">
      //     Select an accounting period to view stats. Stats will only be available
      //     on Labels you have met the upload quota for in the accounting period
      //     selected.
      //   </Text>

      //   <Box pt={4} pb={4}>
      //     {timeFrameOptions && (
      //       <DropDown
      //         name="dateRange"
      //         filters={timeFrameOptions}
      //         handleChangeDropDown={handleChangeTime}
      //       />
      //     )}
      //   </Box>

      //   <div className={styles.box}>
      //     {renderBoxTitle()}
      //     <LabelTable isLoading={isLoading} labels={labels} />
      //   </div>

      //   <SimpleGrid
      //     display={isLargerThan500 ? 'grid' : 'block'}
      //     minChildWidth="400px"
      //     spacing="40px"
      //     mt="40px"
      //   >
      //     <Box className={styles.box}>
      //       <Text fontSize="18px" fontWeight="600" mb={2}>
      //         My Top Labels
      //       </Text>
      //       {renderBoxTitle()}
      //       <AccountingLabel
      //         isLoading={isLoadingGetTopLabels}
      //         topLabels={topLabels}
      //       />
      //     </Box>

      //     <Box className={styles.box}>
      //       <Text fontSize="18px" fontWeight="600" mb={2}>
      //         My Top Releases
      //       </Text>
      //       {renderBoxTitle()}
      //       <AccountingRelease
      //         isLoading={isLoadingGetTopReleases}
      //         topReleases={topReleases}
      //       />
      //     </Box>

      //     <Box className={styles.box}>
      //       <Text fontSize="18px" fontWeight="600" mb={2}>
      //         My Top Tracks
      //       </Text>
      //       {renderBoxTitle()}
      //       <AccountingTrack
      //         isLoading={isLoadingGetTopTracks}
      //         topTracks={topTracks}
      //       />
      //     </Box>

      //     <Box className={styles.box}>
      //       <Text fontSize="18px" fontWeight="600" mb={2}>
      //         My Top Countries
      //       </Text>
      //       {renderBoxTitle()}
      //       <AccountingCountry
      //         isLoading={isLoadingTopCountries}
      //         topCountries={topCountries}
      //       />
      //     </Box>
      //   </SimpleGrid>
      // </div>
    );
  },
);
