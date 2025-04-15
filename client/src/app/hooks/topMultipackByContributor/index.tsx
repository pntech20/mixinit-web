import { getTopReleaseByContributorDetail } from 'app/apis/top10Lits';
import { DATE_RANGE } from 'app/constants/enum';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTopReleaseByContributor = () => {
  const [
    selectedTimeForReleaseByContributor,
    setSelectedTimeForReleaseByContributor,
  ] = useState(DATE_RANGE.LAST_30_DAYS);
  const [listTopReleaseByContributor, setTopReleaseByContributor] =
    useState<any>();
  const { actions } = useTrackSlice();
  const [visibleReleasesIndex, setVisibleReleasesIndex] = useState<any>({});
  const [loadingReleaseIndexes, setLoadingReleaseIndexes] = useState<any>([]);
  const [itemReleaseData, setItemReleaseData] = useState({});

  const handleClickTopRelease = async (labelId, newTime, index) => {
    const dataKey = `${index}-${newTime}`;
    if (visibleReleasesIndex[dataKey]) {
      setVisibleReleasesIndex(prevVisibleRelease => ({
        ...prevVisibleRelease,
        [dataKey]: null,
      }));
    } else {
      setVisibleReleasesIndex(prevVisibleRelease => ({
        ...prevVisibleRelease,
        [dataKey]: labelId,
      }));
      if (!itemReleaseData[dataKey]) {
        setLoadingReleaseIndexes(prevLoadingIndexes => [
          ...prevLoadingIndexes,
          dataKey,
        ]);
        const result = await getTopReleaseByContributorDetail(labelId, newTime);
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

  const handleTimeChangeForTopReleaseByContributor = (
    newTime,
    selectedItem,
  ) => {
    setSelectedTimeForReleaseByContributor(newTime);
    Object.keys(visibleReleasesIndex).forEach(dataKey => {
      const [index] = dataKey.split('-');
      const newKey = `${index}-${newTime}`;
      if (visibleReleasesIndex[dataKey] && !itemReleaseData[newKey]) {
        setVisibleReleasesIndex(prevVisibleRelease => ({
          ...prevVisibleRelease,
          [newKey]: visibleReleasesIndex[dataKey],
        }));
        setLoadingReleaseIndexes(prevLoadingIndexes => [
          ...prevLoadingIndexes,
          newKey,
        ]);
        getTopReleaseByContributorDetail(
          visibleReleasesIndex[dataKey],
          newTime,
        ).then(result => {
          setItemReleaseData(prevData => ({
            ...prevData,
            [newKey]: result?.releases,
          }));
          setLoadingReleaseIndexes(prevLoadingIndexes =>
            prevLoadingIndexes.filter(i => i !== newKey),
          );
        });
      }
    });
  };

  return {
    setSelectedTimeForReleaseByContributor,
    selectedTimeForReleaseByContributor,
    setTopReleaseByContributor,
    handleTimeChangeForTopReleaseByContributor,
    updateWishlistStatusForTopRelease,
    listTopReleaseByContributor,
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
