import { SORT_TYPE } from 'app/constants/enum';
import { IOption } from 'app/constants/interface';
import { useMemo } from 'react';

export const useSorts = () => {
  const sortByTrackOptionsV1: IOption[] = useMemo(
    () => [
      {
        label: 'Top movers',
        value: SORT_TYPE.CREATED_AT_DESC,
      },
      {
        label: 'Top movers',
        value: SORT_TYPE.CREATED_AT_ASC,
      },
      {
        label: 'Top movdsdsders',
        value: SORT_TYPE.TOTAL_BUYS_DESC,
      },
      {
        label: 'Top movers',
        value: SORT_TYPE.TOTAL_LIKES_DESC,
      },
    ],
    [],
  );

  return {
    sortByTrackOptionsV1,
  };
};
