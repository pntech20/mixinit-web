import { useCallback } from 'react';
import { ApiSearchSpotify } from 'app/apis/spotify';

export const useSpotify = () => {
  const searchSpotify = useCallback(async (searchTerm, typeSearch) => {
    const data = {
      searchTerm,
      typeSearch,
    };
    try {
      if (searchTerm) {
        const res = await ApiSearchSpotify(data);
        if (res && res[`${typeSearch}s`] && res[`${typeSearch}s`].items) {
          return res[`${typeSearch}s`].items;
        }
      }
    } catch (error) {}
    return [];
  }, []);

  return {
    searchSpotify,
  };
};
