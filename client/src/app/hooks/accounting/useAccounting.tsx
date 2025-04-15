import { ACCOUNTING_TABS, TIME_FRAMES } from 'app/constants/enum';
import { AccountingOverview } from 'app/pages/Accounting/components/AccountingOverview/Loadable';
import { ReleasesTab } from 'app/pages/Accounting/components/ReleasesTab/Loadable';
import { TracksTab } from 'app/pages/Accounting/components/TracksTab/Loadable';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useSelector } from 'react-redux';
import dateTimeService from 'app/services/datetime.service';
import { getSales, getSummary } from 'app/apis/sale';
import { SubscriptionsTab } from 'app/pages/Accounting/components/SubscriptionsTab/Loadable';
import { getSubscription } from 'app/apis/subscription ';
import { formatMoney } from 'app/utils/currency';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
export const useAccounting = () => {
  const {
    userDetail: { canUploadToLabels: userLabels },
  } = useSelector(selectAuth);
  const [selectedTab, setSelectedTab] = useState(ACCOUNTING_TABS.OVERVIEW);
  const [selectedTabTrack, setSelectedTabTrack] = useState<boolean>(false);
  const [selectedTabReleases, setSelectedTabReleases] =
    useState<boolean>(false);
  const [dataSummary, setDataSummary] = useState<any>();
  const [dataSale, setDataSale] = useState<any>();
  const [dataSubscription, setDataSubscription] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();
  const { search } = useLocation();

  const timeFrameOptions = useMemo(() => {
    return [
      { label: 'Current Month', value: TIME_FRAMES.CURRENT_MONTH },
      { label: 'Last Month', value: TIME_FRAMES.LAST_MONTH },
      { label: 'All Time', value: TIME_FRAMES.ALL_TIME },
    ];
  }, []);

  const canUploadToLabels = useMemo(() => {
    const listUserLabels = (userLabels || [])?.map(label => ({
      label: label?.name,
      value: label?._id,
    }));

    return [{ label: 'All Labels', value: 'all' }].concat(listUserLabels);
  }, [userLabels]);

  const [startTime, setStartTime] = useState<any>(
    dateTimeService.startDateUnixOfCurrentMonth(),
  );
  const [endTime, setEndTime] = useState<any>(
    dateTimeService.endDateUnixOfCurrentMonth(),
  );

  const [startDate, setStartDate] = useState<any>(
    dayjs().utc().startOf('month').format('MM/DD/YYYY'),
  );
  const [endDate, setEndDate] = useState<any>(
    dayjs().utc().endOf('month').format('MM/DD/YYYY'),
  );

  const [dateTime, setDateTime] = useState<string>(
    dayjs().utc().format('YYYY-MM'),
  );
  const [isAllTime, setIsAllTime] = useState(false);

  const handleOptionChange = event => {
    const value = event.target.value;
    if (value === 'all-time') {
      setIsAllTime(true);
      setStartTime(() => 0);
      setEndTime(() => 0);
    } else {
      setIsAllTime(false);
      setStartTime(() => dateTimeService.startDateUnixOfCurrentMonth());
      setEndTime(() => dateTimeService.endDateUnixOfCurrentMonth());
    }
  };
  const [selectedLabel, setSelectedLabel] = useState(canUploadToLabels[0]);

  const onChangeTime = useCallback(dateString => {
    let startTime = 0;
    let endTime = 0;
    if (dateString) {
      const [year, month] = dateString && dateString.split('-');
      startTime = dateTimeService.startDateUnixOfMonth(year, month);
      endTime = dateTimeService.endDateUnixOfMonth(year, month);
      setStartDate(
        dayjs(`${year}-${month}-01`).startOf('month').format('MM/DD/YYYY'),
      );
      setEndDate(
        dayjs(`${year}-${month}-01`).endOf('month').format('MM/DD/YYYY'),
      );
    } else {
      startTime = dateTimeService.startDateUnixOfCurrentMonth();
      endTime = dateTimeService.endDateUnixOfCurrentMonth();
      setStartDate(dayjs().utc().startOf('month').format('MM/DD/YYYY'));
      setEndDate(dayjs().utc().endOf('month').format('MM/DD/YYYY'));
    }
    setStartTime(() => startTime);
    setEndTime(() => endTime);
  }, []);

  const handleChangeTimeFrame = useCallback(value => {
    let startTime = 0;
    let endTime = 0;

    if (value === TIME_FRAMES.CURRENT_MONTH) {
      startTime = dateTimeService.startDateUnixOfCurrentMonth();
      endTime = dateTimeService.endDateUnixOfCurrentMonth();
    }

    if (value === TIME_FRAMES.LAST_MONTH) {
      startTime = dateTimeService.startDateUnixBeforeMonth(1);
      endTime = dateTimeService.endDateUnixOfBeforeMonth(1);
    }

    return {
      startTime,
      endTime,
    };
  }, []);

  const onChangeSelectLabel = useCallback(
    (label: string) => {
      const selectedLabel =
        canUploadToLabels.find(it => it.value === label) ||
        canUploadToLabels[0];
      setSelectedLabel(selectedLabel);
    },
    [canUploadToLabels],
  );

  const onChangeTabTrack = useCallback(() => {
    setSelectedTabTrack(!selectedTabTrack);
  }, [selectedTabTrack]);

  const onChangeTabReleases = useCallback(() => {
    setSelectedTabReleases(!selectedTabReleases);
  }, [selectedTabReleases]);

  const tabOptions = [
    {
      label: 'Overview',
      value: ACCOUNTING_TABS.OVERVIEW,
      component: (
        <AccountingOverview
          startTime={startTime}
          endTime={endTime}
          selectedLabel={selectedLabel?.value}
          dataSale={dataSale}
        />
      ),
    },
    {
      label: 'Tracks',
      value: ACCOUNTING_TABS.TRACKS,
      component: (
        <TracksTab
          onChangeTabTrack={onChangeTabTrack}
          selectedTabTrack={selectedTabTrack}
          dataSale={dataSale}
          dataSummary={dataSummary}
        />
      ),
    },
    {
      label: 'Multipacks',
      value: ACCOUNTING_TABS.RELEASES,
      component: (
        <ReleasesTab
          onChangeTabReleases={onChangeTabReleases}
          selectedTabReleases={selectedTabReleases}
          dataSale={dataSale}
          dataSummary={dataSummary}
        />
      ),
    },

    {
      label: 'Subscriptions',
      value: ACCOUNTING_TABS.SUBSCRIPTIONS,
      component: (
        <SubscriptionsTab
          dataSale={dataSubscription}
          dataSummary={dataSummary}
        />
      ),
    },
  ];
  const query = queryString.parse(search);
  useEffect(() => {
    if (query && query.tab) {
      const selectedTabs = query.tab || ACCOUNTING_TABS.OVERVIEW;
      setSelectedTab(selectedTabs as ACCOUNTING_TABS);
    }
  }, [query, search]);

  const onChangeTab = (index: number) => {
    const selectedTabs = tabOptions[index]?.value || ACCOUNTING_TABS.OVERVIEW;
    setSelectedTab(selectedTabs);
    history.push({
      pathname: '/accounting',
      search: `?tab=${selectedTabs}`,
    });
    setSelectedTabTrack(false);
    setSelectedTabReleases(false);
  };

  const onGetSale = useCallback(async (payload: any) => {
    setIsLoading(true);
    const data: any = await getSales(payload);
    setDataSale(data);
    setIsLoading(false);
  }, []);
  const onGetSummary = useCallback(async (payload: any) => {
    setIsLoading(true);
    const data = await getSummary(payload);
    setDataSummary(data);
    setIsLoading(false);
  }, []);

  const onGetSubscription = useCallback(async (payload: any) => {
    setIsLoading(true);
    const data = await getSubscription(payload);
    setDataSubscription(data);
    setIsLoading(false);
  }, []);

  const columnsOverview = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return dayjs(original.createdAt).utc().format('MM/DD/YYYY hh:mm A');
        },
      },
      {
        Header: 'Country',
        accessor: 'country',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.country;
        },
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.type === 'track' ? original?.type : 'multipack';
        },
      },
      {
        Header: 'Label',
        accessor: 'label.name',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.label?.name;
        },
      },
      {
        Header: 'Item',
        accessor: 'item',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.item;
        },
      },
      {
        Header: 'Gross',
        accessor: 'grossIncome',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.grossIncome);
        },
      },
      {
        Header: 'Fee',
        accessor: 'fee',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.fee);
        },
      },
      {
        Header: 'Discount',
        accessor: 'discount',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.discount || 0);
        },
      },
      {
        Header: 'Net',
        accessor: 'netIncome',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.netIncome);
        },
      },
      {
        Header: 'Split',
        accessor: 'splitPCT',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return `${original?.splitPCT}%`;
        },
      },
      {
        Header: 'Earned',
        accessor: 'earned',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.earned);
        },
      },
    ],
    [],
  );

  const columnsTracksSalesLog = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return dayjs(original.createdAt).utc().format('MM/DD/YYYY hh:mm A');
        },
      },
      {
        Header: 'Country',
        accessor: 'country',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.country;
        },
      },
      {
        Header: 'Track',
        accessor: 'track.title',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.track?.title;
        },
      },
      {
        Header: 'Gross',
        accessor: 'grossIncome',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.grossIncome);
        },
      },
      {
        Header: 'Fee',
        accessor: 'fee',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.fee);
        },
      },
      {
        Header: 'Discount',
        accessor: 'discount',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.discount || 0);
        },
      },
      {
        Header: 'Net',
        accessor: 'netIncome',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.netIncome);
        },
      },
      {
        Header: 'Split',
        accessor: 'splitPCT',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return `${original?.splitPCT}%`;
        },
      },
      {
        Header: 'Earned',
        accessor: 'earned',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.earned);
        },
      },
    ],
    [],
  );

  const columnsTrackSummary = useMemo(
    () => [
      {
        Header: 'Track',
        accessor: 'track.title',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.track?.title;
        },
      },
      {
        Header: `DL'S`,
        accessor: 'totalSold',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.totalSold;
        },
      },
      {
        Header: 'You Earned',
        accessor: 'totalEarned',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.totalEarned);
        },
      },
    ],
    [],
  );

  const columnsReleasesSalesLog = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return dayjs(original.createdAt).utc().format('MM/DD/YYYY hh:mm A');
        },
      },
      {
        Header: 'Country',
        accessor: 'country',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.country;
        },
      },
      {
        Header: 'Multipack',
        accessor: 'release.title',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.release?.title;
        },
      },
      {
        Header: 'Gross',
        accessor: 'grossIncome',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.grossIncome);
        },
      },
      {
        Header: 'Fee',
        accessor: 'fee',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.fee);
        },
      },
      {
        Header: 'Discount',
        accessor: 'discount',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.discount || 0);
        },
      },
      {
        Header: 'Net',
        accessor: 'netIncome',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.netIncome);
        },
      },
      {
        Header: 'Split',
        accessor: 'splitPCT',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return `${original?.splitPCT}%`;
        },
      },
      {
        Header: 'Earned',
        accessor: 'earned',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.earned);
        },
      },
    ],
    [],
  );

  const columnsReleasesSummary = useMemo(
    () => [
      {
        Header: 'Multipack',
        accessor: 'release.title',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.release?.title;
        },
      },
      {
        Header: `DL'S`,
        accessor: 'totalSold',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.totalSold;
        },
      },
      {
        Header: 'You Earned',
        accessor: 'totalEarned',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return formatMoney(original?.totalEarned);
        },
      },
    ],
    [],
  );

  const columnsSubscriptions = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return dayjs(original.createdAt).utc().format('MM/DD/YYYY hh:mm A');
        },
      },
      {
        Header: 'Country',
        accessor: 'country',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.country;
        },
      },
      {
        Header: 'Label',
        accessor: 'label.name',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.label?.name;
        },
      },
      {
        Header: `Track`,
        accessor: 'track.title',
        Cell: ({
          cell: {
            row: { original },
          },
        }) => {
          return original?.track?.title;
        },
      },
    ],
    [],
  );

  const handleGetData = useCallback(() => {
    if (selectedLabel.value && query.tab) {
      const data = {
        startTime,
        endTime,
        label: selectedLabel.value,
        type:
          query.tab === ACCOUNTING_TABS.OVERVIEW
            ? 'all'
            : query.tab === ACCOUNTING_TABS.TRACKS
            ? 'track'
            : query.tab === ACCOUNTING_TABS.SUBSCRIPTIONS
            ? 'subscriptions'
            : 'release',
      };
      if (query.tab === ACCOUNTING_TABS.OVERVIEW) onGetSale(data);
      if (query.tab === ACCOUNTING_TABS.SUBSCRIPTIONS) onGetSubscription(data);
      if (
        query.tab === ACCOUNTING_TABS.TRACKS ||
        query.tab === ACCOUNTING_TABS.RELEASES
      ) {
        onGetSale(data);
        onGetSummary(data);
      }
    } else {
      const data = {
        startTime,
        endTime,
        label: selectedLabel.value,
        type: 'all',
      };
      onGetSale(data);
    }
  }, [
    endTime,
    onGetSale,
    onGetSubscription,
    onGetSummary,
    query.tab,
    selectedLabel.value,
    startTime,
  ]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return {
    startTime,
    endTime,
    tabOptions,
    onChangeTab,
    selectedTab,
    canUploadToLabels,
    userLabels,
    onChangeTime,
    timeFrameOptions,
    selectedLabel,
    onChangeSelectLabel,
    handleChangeTimeFrame,
    onGetSale,
    dataSale,
    onGetSummary,
    dataSummary,
    isLoading,
    onChangeTabTrack,
    selectedTabTrack,
    onChangeTabReleases,
    selectedTabReleases,
    columnsOverview,
    columnsTracksSalesLog,
    columnsTrackSummary,
    columnsReleasesSalesLog,
    columnsReleasesSummary,
    columnsSubscriptions,
    dataSubscription,
    dateTime,
    setDateTime,
    handleOptionChange,
    isAllTime,
    startDate,
    endDate,
  };
};
