import { useAccountingReleasesSlice } from 'app/pages/Accounting/components/ReleasesTab/slice';
import { selectAccountingReleases } from 'app/pages/Accounting/components/ReleasesTab/slice/selectors';
import { GetAccountingPayload } from 'app/pages/Accounting/slice/types';
import dateTimeService from 'app/services/datetime.service';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPaginationParams } from 'utils/pagination';

export const useReleaseAccounting = () => {
  const dispatch = useDispatch();
  const { actions } = useAccountingReleasesSlice();
  const { isLoading, releases = [] } = useSelector(selectAccountingReleases);

  const DEFAULT_FILTERS = useMemo(() => {
    return {
      page: 1,
      perPage: 100000,
      search: '',
      startTime: dateTimeService.startDateUnixOfCurrentMonth(),
      endTime: dateTimeService.endDateUnixOfCurrentMonth(),
    };
  }, []);

  const filter = DEFAULT_FILTERS;

  const onGetReleaseAccounting = useCallback(
    dataFilter => {
      const page = filter.page || 1;
      const perPage = filter.perPage || 100000;
      const params = getPaginationParams({ page, pageSize: perPage });

      const payload: GetAccountingPayload = {
        params: params,
        filter: { ...filter, ...dataFilter },
      };
      dispatch(actions.accountingReleaseRequest(payload));
    },
    [actions, dispatch, filter],
  );

  return {
    isLoading,
    releases,
    filter,
    onGetReleaseAccounting,
  };
};
