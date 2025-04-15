import { TIME_FRAMES } from 'app/constants/enum';
import { selectAccounting } from 'app/pages/Accounting/slice/selectors';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export const useOverviewAccounting = () => {
  const { isLoading, labels = [] } = useSelector(selectAccounting);

  const timeFrameOptions = useMemo(() => {
    return [
      { label: 'Current Month', value: TIME_FRAMES.CURRENT_MONTH },
      { label: 'Last Month', value: TIME_FRAMES.LAST_MONTH },
      { label: 'All Time', value: TIME_FRAMES.ALL_TIME },
    ];
  }, []);
  const [selectedTime, setSelectedTime] = useState(timeFrameOptions[0]);

  const onChangeTime = useCallback(
    (time: string) => {
      const selectedTime =
        timeFrameOptions.find(it => it.value === time) || timeFrameOptions[0];
      setSelectedTime(selectedTime);
    },
    [timeFrameOptions],
  );

  return {
    isLoading,
    labels,
    timeFrameOptions,
    selectedTime,
    onChangeTime,
  };
};
