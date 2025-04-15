import {
  Box,
  Flex,
  Select,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Banner } from 'app/components/Banner';
import DropDown from 'app/components/Common/Dropdowns';
import TabButton from 'app/components/Common/TabButton';
import { HelmetPage } from 'app/components/HelmetPage';
import { ACCOUNTING_TABS } from 'app/constants/enum';
import { useAccounting } from 'app/hooks/accounting/useAccounting';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Styles from './index.module.scss';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
export const Accounting = memo(() => {
  const {
    tabOptions,
    selectedTab,
    onChangeTab,
    canUploadToLabels,
    onChangeTime,
    onChangeSelectLabel,
    dataSale,
    dataSummary,
    selectedTabTrack,
    dataSubscription,
    selectedTabReleases,
    columnsOverview,
    columnsTracksSalesLog,
    columnsTrackSummary,
    columnsReleasesSalesLog,
    columnsReleasesSummary,
    columnsSubscriptions,
    startTime,
    dateTime,
    setDateTime,
    handleOptionChange,
    isAllTime,
    startDate,
    endDate,
  } = useAccounting();
  const { isLargerThan992 } = useMediaScreen();

  const data = useMemo(() => {
    switch (selectedTab) {
      case ACCOUNTING_TABS.OVERVIEW:
        const dataOverview = dataSale
          ? dataSale.map(i => ({
              ...i,
              item: i.track ? i.track?.title : i.release?.title,
              type: i.type === 'release' ? 'multipack' : i.type,
            }))
          : [];
        return dataOverview || [];
      case ACCOUNTING_TABS.TRACKS:
        return (selectedTabTrack ? dataSummary : dataSale) || [];
      case ACCOUNTING_TABS.RELEASES:
        return (selectedTabReleases ? dataSummary : dataSale) || [];
      case ACCOUNTING_TABS.SUBSCRIPTIONS:
        const dataSubscriptions = dataSubscription
          ? dataSubscription.map(i => ({
              ...i,
              item: i.track ? i.track?.title : i.release?.title,
            }))
          : [];
        return dataSubscriptions || [];
      default:
        return [];
    }
  }, [
    dataSale,
    dataSubscription,
    dataSummary,
    selectedTab,
    selectedTabReleases,
    selectedTabTrack,
  ]);

  const headers = useMemo(() => {
    switch (selectedTab) {
      case ACCOUNTING_TABS.OVERVIEW:
        const filter = columnsOverview
          .filter(col => col?.accessor)
          .map(i => ({
            label: i.Header,
            key: i.accessor,
          }));
        return filter;
      case ACCOUNTING_TABS.TRACKS:
        const filterTracks = (
          selectedTabTrack ? columnsTrackSummary : columnsTracksSalesLog
        )
          .filter(col => col?.accessor)
          .map(i => ({
            label: i.Header,
            key: i.accessor,
          }));
        return filterTracks;
      case ACCOUNTING_TABS.RELEASES:
        const filterReleases = (
          selectedTabReleases ? columnsReleasesSummary : columnsReleasesSalesLog
        )
          .filter(col => col?.accessor)
          .map(i => ({
            label: i.Header,
            key: i.accessor,
          }));
        return filterReleases;
      case ACCOUNTING_TABS.SUBSCRIPTIONS:
        const filterSubscriptions = columnsSubscriptions
          .filter(col => col?.accessor)
          .map(i => ({
            label: i.Header,
            key: i.accessor,
          }));
        return filterSubscriptions;
      default:
        return [];
    }
  }, [
    columnsOverview,
    columnsReleasesSalesLog,
    columnsReleasesSummary,
    columnsSubscriptions,
    columnsTrackSummary,
    columnsTracksSalesLog,
    selectedTab,
    selectedTabReleases,
    selectedTabTrack,
  ]);

  const filename = useMemo(() => {
    switch (selectedTab) {
      case ACCOUNTING_TABS.OVERVIEW:
        return 'Accounting-Overview.csv';
      case ACCOUNTING_TABS.TRACKS:
        return selectedTabTrack
          ? 'Accounting-Tracks-Summary.csv'
          : 'Accounting-Tracks-Sales-Log.csv';
      case ACCOUNTING_TABS.RELEASES:
        return selectedTabReleases
          ? 'Accounting-Releases-Summary.csv'
          : 'Accounting-Releases-Sales-Log.csv';
      case ACCOUNTING_TABS.SUBSCRIPTIONS:
        return 'Accounting-Overview-Subscriptions.csv';
      default:
        return 'Accounting.csv';
    }
  }, [selectedTab, selectedTabReleases, selectedTabTrack]);

  const csvReport = {
    data,
    headers,
    filename,
  };

  const renderTimeAccounting = () => {
    return (
      <Box mt="15px" fontWeight="bold">
        <Text color="red" fontWeight={600} fontSize={16}>
          Accounting data is based on UTC timezone
        </Text>
        VIEWING ACCOUNTING PERIOD:{' '}
        {startTime === 0 ? 'ALL TIME' : `${startDate} - ${endDate}`}
      </Box>
    );
  };

  return (
    <Box>
      <HelmetPage title="Accounting" />
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
      <Text fontSize="18px">
        Select an accounting period and label to display relevant data. Download
        a CSV of the data you are viewing by using the CSV button.
      </Text>
      <Flex
        mt="10px"
        justifyContent="space-between"
        alignItems="center"
        display={{ base: 'block', sm: 'flex' }}
      >
        <Flex gridGap="10px" display={{ base: 'block', sm: 'flex' }}>
          <Box>
            <Text fontSize="12px" mb={1}>
              Accounting Period:
            </Text>

            <Flex h="40px" borderRadius="3px" gridGap="10px">
              <Select
                onChange={handleOptionChange}
                value={isAllTime ? 'all-time' : 'select-date'}
              >
                <option value="select-date">Select Time</option>
                <option value="all-time">All Time</option>
              </Select>
              {!isAllTime && (
                <DatePicker
                  selected={
                    dayjs(dateTime).isValid()
                      ? dayjs(dateTime).toDate()
                      : new Date()
                  }
                  onChange={date => {
                    const formattedDate = dayjs(date).format('YYYY-MM');
                    onChangeTime(formattedDate);
                    setDateTime(formattedDate);
                  }}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  maxDate={dayjs().utc().format('YYYY-MM')}
                  className={`${Styles.themePicker}`}
                />
              )}
            </Flex>
          </Box>
          <Box>
            <Text fontSize="12px" mb={1}>
              Label:
            </Text>
            {canUploadToLabels && (
              <DropDown
                name="dateRange"
                width="200px"
                filters={canUploadToLabels}
                handleChangeDropDown={onChangeSelectLabel}
              />
            )}
          </Box>
        </Flex>
        <CSVLink {...csvReport}>
          <Box
            borderRadius="5px"
            bg={useColorModeValue('#242424', '#FFFFFF')}
            padding="4px 10px"
            mt="20px"
            width="55px"
            ml={{ base: '0px', sm: '10px' }}
          >
            <Text
              fontWeight="700"
              color={useColorModeValue('#FFFFFF', '#000000')}
            >
              CSV
            </Text>
          </Box>
        </CSVLink>
      </Flex>

      {renderTimeAccounting()}
      <Tabs
        variant="unstyled"
        onChange={onChangeTab}
        index={tabOptions.findIndex(it => it.value === selectedTab)}
        mt="30px"
      >
        <TabList
          mb="10px"
          display="flex"
          width={{ md: 'max-content' }}
          flexWrap="wrap"
          border={{ md: '1px solid #e2e2e2' }}
          gridGap={{ base: '8px', md: '0px' }}
        >
          {tabOptions.map((item, index) => (
            <TabButton
              key={item.value}
              text={item.label}
              ml={index === 0 ? '0px' : '10px'}
              isAccounting
            />
          ))}
        </TabList>

        <TabPanels mt="0px" p="0">
          {tabOptions.map(it => (
            <TabPanel key={it.value} padding="0px">
              {selectedTab === it.value && it.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
});
