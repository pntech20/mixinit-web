import { getTopReleaseByLabelDetail } from 'app/apis/top10Lits';
import { DATE_RANGE } from 'app/constants/enum';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTopReleaseByLabel = () => {
  const [selectedTimeForRelease, setSelectedTimeForRelease] = useState(
    DATE_RANGE.LAST_30_DAYS,
  );
  const [listTopReleaseByLabel, setTopReleaseByLabel] = useState<any>();
  const { actions } = useTrackSlice();
  const [visibleReleasesIndex, setVisibleReleasesIndex] = useState<any>({});
  const [loadingReleaseIndexes, setLoadingReleaseIndexes] = useState<any>([]);
  const [itemReleaseData, setItemReleaseData] = useState({});

  const handleClickTopRelease = async (labelId, newTime, index) => {
    const dataKey = `${index}-${newTime}`;
    if (visibleReleasesIndex[dataKey]) {
      setVisibleReleasesIndex(prevVisibleTracks => ({
        ...prevVisibleTracks,
        [dataKey]: null,
      }));
    } else {
      setVisibleReleasesIndex(prevVisibleTracks => ({
        ...prevVisibleTracks,
        [dataKey]: labelId,
      }));
      if (!itemReleaseData[dataKey]) {
        setLoadingReleaseIndexes(prevLoadingIndexes => [
          ...prevLoadingIndexes,
          dataKey,
        ]);

        const result = await getTopReleaseByLabelDetail(labelId, newTime);

        setItemReleaseData(prevData => ({
          ...prevData,
          [dataKey]: result?.releases,
        }));
        setLoadingReleaseIndexes(prevLoadingIndexes =>
          prevLoadingIndexes.filter(i => i !== dataKey),
        );
      }
    }
  };

  const dispatch = useDispatch();

  const updateWishlistStatusForTopRelease = (releaseId, isBelong) => {
    setItemReleaseData(prevData => {
      const newData = { ...prevData };
      for (let key in newData) {
        newData[key] = newData[key].map(item =>
          item._id === releaseId
            ? { ...item, isBelongMyWishlist: !isBelong }
            : item,
        );
      }
      return newData;
    });
  };

  const handleTimeChangeForTopRelease = (newTime, selectedItem) => {
    setSelectedTimeForRelease(newTime);
    Object.keys(visibleReleasesIndex).forEach(dataKey => {
      const [index] = dataKey.split('-');
      const newKey = `${index}-${newTime}`;
      if (visibleReleasesIndex[dataKey] && !itemReleaseData[newKey]) {
        setVisibleReleasesIndex(prevVisibleTracks => ({
          ...prevVisibleTracks,
          [newKey]: visibleReleasesIndex[dataKey],
        }));
        setLoadingReleaseIndexes(prevLoadingIndexes => [
          ...prevLoadingIndexes,
          newKey,
        ]);
        getTopReleaseByLabelDetail(visibleReleasesIndex[dataKey], newTime).then(
          result => {
            setItemReleaseData(prevData => ({
              ...prevData,
              [newKey]: result?.releases,
            }));
            setLoadingReleaseIndexes(prevLoadingIndexes =>
              prevLoadingIndexes.filter(i => i !== newKey),
            );
          },
        );
      }
    });
  };

  return {
    setSelectedTimeForRelease,
    selectedTimeForRelease,
    setTopReleaseByLabel,
    handleTimeChangeForTopRelease,
    updateWishlistStatusForTopRelease,
    listTopReleaseByLabel,
    dispatch,
    actions,
    visibleReleasesIndex,
    setVisibleReleasesIndex,
    setItemReleaseData,
    handleClickTopRelease,
    loadingReleaseIndexes,
    itemReleaseData,
  };
};
