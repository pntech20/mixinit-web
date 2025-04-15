import defaultMyMediaImg from 'app/assets/banners/services_av_slots.png';
import { BANNER_PAGE, MY_MEDIA_TYPE } from 'app/constants/enum';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useBanners } from '../banners/useBanners';

export const useMymedia = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [tabIndex, setTabIndex] = useState(MY_MEDIA_TYPE.MY_TRACKS);
  const { banners } = useBanners();
  const history = useHistory();

  useEffect(() => {
    const query = queryString.parse(search);
    if (query && query.tab) {
      setTabIndex(+query.tab || 0);
    }
  }, [search]);

  const options = useMemo(() => ['TRACKS', 'RELEASES'], []);

  const [myTracksBanner, setMyTracksBanner] = useState(defaultMyMediaImg);
  const [myReleasesBanner, setMyReleasesBanner] = useState(defaultMyMediaImg);
  const [myPlaylistsBanner, setMyPlaylistsBanner] = useState(defaultMyMediaImg);

  useEffect(() => {
    const trackImg = banners.find(item => item.page === BANNER_PAGE.MYTRACKS);
    const releaseImg = banners.find(
      item => item.page === BANNER_PAGE.MYRELEASES,
    );
    const playlistImg = banners.find(
      item => item.page === BANNER_PAGE.MYPLAYLISTS,
    );

    if (trackImg) {
      setMyTracksBanner(trackImg?.url);
    }

    if (releaseImg) {
      setMyReleasesBanner(releaseImg?.url);
    }

    if (playlistImg) {
      setMyPlaylistsBanner(playlistImg?.url);
    }
  }, [banners]);

  const banner = useMemo(() => {
    const bgImg =
      tabIndex === MY_MEDIA_TYPE.MY_TRACKS
        ? myTracksBanner
        : tabIndex === MY_MEDIA_TYPE.MY_RELEASES
        ? myReleasesBanner
        : myPlaylistsBanner;

    const title =
      tabIndex === MY_MEDIA_TYPE.MY_TRACKS
        ? t('myMedia.myTrack')
        : tabIndex === MY_MEDIA_TYPE.MY_RELEASES
        ? t('myMedia.myRelease')
        : t('myMedia.myPlaylist');

    return {
      bgImg,
      title,
      description: 'CrooklynClan Media Control Center',
      classname: 'banner',
    };
  }, [myPlaylistsBanner, myReleasesBanner, myTracksBanner, t, tabIndex]);

  const handleChange = useCallback(
    value => {
      setTabIndex(value);
      history.push({
        pathname: '/my-releases',
        search: `?tab=${value}`,
      });
    },
    [history, setTabIndex],
  );

  return { options, tabIndex, banner, setTabIndex, handleChange };
};
