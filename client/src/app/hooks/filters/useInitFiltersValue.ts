import { useCallback } from 'react';
import { useCommunity } from '../Community/useCommunity';
import { useGenres } from '../genres/useGenres';
import { useSections } from '../sections/useSections';
import { useTags } from '../tags/useTags';
import { useTracksKeys } from '../trackKeys/useTrackKeys';
import { useTracks } from '../tracks/useTracks';

export const useInitFiltersValue = () => {
  const { onGetTags } = useTags();
  const { onGetGenres } = useGenres();
  const { onGetSections } = useSections();
  const { onGetTrackKeys } = useTracksKeys();
  const { onGetContributors, onGetCommunity } = useCommunity();
  const { getTokenMax } = useTracks();

  const onInitFilterValues = useCallback(() => {
    onGetTags({ search: '', sort: 'name@asc' });
    onGetGenres({ search: '', sort: 'name@asc' });
    onGetSections();
    onGetTrackKeys();
    onGetContributors();
    onGetCommunity();
    getTokenMax();
  }, [
    onGetTags,
    onGetGenres,
    onGetSections,
    onGetTrackKeys,
    onGetContributors,
    onGetCommunity,
    getTokenMax,
  ]);

  return { onInitFilterValues };
};
