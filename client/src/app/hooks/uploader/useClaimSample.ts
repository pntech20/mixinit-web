import { useCallback, useState } from 'react';
import { useSpotify } from 'app/hooks/spotify/useSpotify';
import youtube from '../../apis/youtube';
import { toastError } from 'app/helpers/toast';

export const useClaimSample = setListClaimSamples => {
  const { searchSpotify } = useSpotify();

  const [spotifyTracks, setTrackSearchSpotify] = useState<any>([]);
  const [valueTrackSearchSpotify, setValueTrackSearchSpotify] =
    useState<any>(null);
  const [valueTrackSearchYtb, setValueTrackSearchYtb] = useState<any>(null);
  const [valueTrackSpotify, setValueTrackSpotify] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [listResultYtb, setListResultYtb] = useState<any>(null);
  const [isLoadingYtb, setLoadingYtb] = useState<boolean>(false);
  const [isShowResultSpotify, setShowResultSpotify] = useState<boolean>(false);
  const [isShowResultYtb, setShowResultYtb] = useState<boolean>(false);

  const handleSearchSpotify = useCallback(async () => {
    const res = await searchSpotify(valueTrackSearchSpotify, 'track');
    setTrackSearchSpotify(res);
    setShowResultSpotify(true);
  }, [searchSpotify, valueTrackSearchSpotify]);

  const handleSearchYoutube = useCallback(async () => {
    try {
      setLoadingYtb(true);
      const response = await youtube.get('/search', {
        params: {
          q: query,
        },
      });
      const result = response.data.items?.map(i => i?.snippet);
      setListResultYtb(result);
    } catch (error) {
      toastError('Something went wrong!');
    } finally {
      setLoadingYtb(false);
      setValueTrackSearchYtb(null);
      setShowResultYtb(true);
    }
  }, [query]);

  const handleKeyPressSpotify = useCallback(
    event => {
      if (event.key === 'Enter') {
        handleSearchSpotify();
      }
    },
    [handleSearchSpotify],
  );

  const handleKeyPressYtb = useCallback(
    event => {
      if (event.key === 'Enter') {
        handleSearchYoutube();
      }
    },
    [handleSearchYoutube],
  );

  const addClaimSamples = useCallback(
    source => {
      setListClaimSamples(pre => [
        ...pre,
        source === 'youtube' ? valueTrackSearchYtb : valueTrackSpotify,
      ]);
      if (source === 'youtube') {
        setValueTrackSearchYtb(null);
        setQuery('');
      } else {
        setValueTrackSpotify(null);
        setValueTrackSearchSpotify('');
      }
    },
    [setListClaimSamples, valueTrackSearchYtb, valueTrackSpotify],
  );

  const handleSelectItemYtb = useCallback(
    item => {
      const videoId = item.thumbnails?.default?.url
        .split('/')[4]
        ?.split('.')[0];
      const originalTrackUrl = `https://www.youtube.com/watch?v=${videoId}`;
      setValueTrackSearchYtb({
        _id: new Date().getTime(),
        source: 'youtube',
        track: item.title,
        originalTrackUrl: originalTrackUrl,
      });
      setQuery(item.title);
      setShowResultYtb(false);
      setListClaimSamples(pre => [
        ...pre,
        {
          _id: new Date().getTime(),
          source: 'youtube',
          track: item.title,
          originalTrackUrl: originalTrackUrl,
        },
      ]);
      setValueTrackSearchYtb(null);
      setQuery('');
    },
    [setListClaimSamples],
  );

  const handleSelectItemSpotify = useCallback(
    item => {
      const title = item?.name;
      const artists = item?.artists?.length
        ? ` - ${item?.artists?.map(art => art?.name)?.join(', ')}`
        : '';
      const track = `${title}${artists}`;

      setValueTrackSpotify({
        _id: new Date().getTime(),
        source: 'spotify',
        track,
        title,
        artists: item?.artists?.map(art => art?.name)?.join(', '),
        originalTrackUrl: item?.external_urls?.spotify,
      });
      setValueTrackSearchSpotify(track);
      setShowResultSpotify(false);
      setListClaimSamples(pre => [
        ...pre,
        {
          _id: new Date().getTime(),
          source: 'spotify',
          track,
          originalTrackUrl: item?.external_urls?.spotify,
          title,
          artists: item?.artists?.map(art => art?.name)?.join(', '),
        },
      ]);
      setValueTrackSpotify(null);
      setValueTrackSearchSpotify('');
    },
    [setListClaimSamples],
  );

  return {
    spotifyTracks,
    setTrackSearchSpotify,
    valueTrackSearchSpotify,
    setValueTrackSearchSpotify,
    addClaimSamples,
    handleSearchSpotify,
    listResultYtb,
    handleSearchYoutube,
    query,
    setQuery,
    handleKeyPressSpotify,
    handleKeyPressYtb,
    isLoadingYtb,
    handleSelectItemYtb,
    valueTrackSearchYtb,
    setValueTrackSearchYtb,
    handleSelectItemSpotify,
    setValueTrackSpotify,
    valueTrackSpotify,
    isShowResultSpotify,
    setShowResultSpotify,
    isShowResultYtb,
    setShowResultYtb,
  };
};
