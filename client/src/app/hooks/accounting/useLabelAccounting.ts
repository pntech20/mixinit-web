import { useAccountingSlice } from 'app/pages/Accounting/slice';
import { selectAccounting } from 'app/pages/Accounting/slice/selectors';
import { GetAccountingPayload } from 'app/pages/Accounting/slice/types';
import dateTimeService from 'app/services/datetime.service';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPaginationParams } from 'utils/pagination';

export const useLabelAccounting = () => {
  const dispatch = useDispatch();
  const { actions } = useAccountingSlice();
  const { isLoading, labels = [] } = useSelector(selectAccounting);

  const DEFAULT_FILTERS = useMemo(() => {
    return {
      page: 1,
      perPage: 1000,
      search: '',
      startTime: dateTimeService.startDateUnixOfCurrentMonth(),
      endTime: dateTimeService.endDateUnixOfCurrentMonth(),
    };
  }, []);

  const filter = DEFAULT_FILTERS;

  const onGetLabelsAccounting = useCallback(
    dataFilter => {
      const page = filter.page || 1;
      const perPage = filter.perPage || 1000;
      const params = getPaginationParams({ page, pageSize: perPage });

      const payload: GetAccountingPayload = {
        params: params,
        filter: { ...filter, ...dataFilter },
      };
      dispatch(actions.accountingLabelRequest(payload));
    },
    [actions, dispatch, filter],
  );

  return {
    isLoading,
    labels,
    filter,
    onGetLabelsAccounting,
  };
};
