import { BannerTrackDetail } from 'app/components/BannerTrackDetail';
import { TRACK_DETAIL_TABS } from 'app/constants/enum';
import { RelatedTracks } from 'app/pages/TracksDetail/elements/RelatedTracks';
import { TracksInRelease } from 'app/pages/TracksDetail/elements/TracksInRelease';
import { useTrackDetailSlice } from 'app/pages/TracksDetail/slice';
import { selectTrackDetail } from 'app/pages/TracksDetail/slice/selectors';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useTrackDetail = () => {
  const dispatch = useDispatch();
  const { actions } = useTrackDetailSlice();
  const { trackInfo, relatedTracks, releases } = useSelector(selectTrackDetail);

  const [selectedTab, setSelectedTab] = useState(
    TRACK_DETAIL_TABS.TRACK_DETAILS,
  );

  const tabOptions = useMemo(
    () => [
      {
        label: 'Track Details',
        value: TRACK_DETAIL_TABS.TRACK_DETAILS,
        component: <BannerTrackDetail track={trackInfo} />,
      },
      {
        label: 'Related Tracks',
        value: TRACK_DETAIL_TABS.RELATED_TRACK,
        component: <RelatedTracks relatedTracks={relatedTracks} />,
      },
      {
        label: 'In Multipacks',
        value: TRACK_DETAIL_TABS.RELEASE,
        component: <TracksInRelease releases={releases} />,
      },
    ],
    [relatedTracks, releases, trackInfo],
  );

  const onChangeTab = useCallback(
    (index: number) => {
      const selectedTab =
        tabOptions[index]?.value || TRACK_DETAIL_TABS.TRACK_DETAILS;
      setSelectedTab(selectedTab);
    },
    [tabOptions],
  );

  const onGetTrackDetail = useCallback(
    (slug: string) => {
      dispatch(
        actions.getTrackDetailRequest({
          slug,
        }),
      );
      dispatch(actions.getReleasesTrackDetailRequest({ slug }));
      dispatch(
        actions.getRelatedTrackDetailRequest({
          slug,
          data: {
            // showAudio:
            //   isEmpty(getLocalStorage('showAudio')) ||
            //   getLocalStorage('showAudio'),
            // showVideo:
            //   isEmpty(getLocalStorage('showVideo')) ||
            //   getLocalStorage('showVideo'),
            clean: true,
            dirty: true,
          },
        }),
      );
    },
    [dispatch, actions],
  );

  return {
    tabOptions,
    onChangeTab,
    selectedTab,
    setSelectedTab,
    trackInfo,
    releases,
    onGetTrackDetail,
  };
};
