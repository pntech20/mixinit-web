import { useCallback } from 'react';

export const useYoutube = () => {
  const searchYouTube = useCallback(async q => {
    const query = encodeURIComponent(q);
    const response = await fetch(
      `https://youtube-search-results.p.rapidapi.com/youtube-search/?q=
        ${query}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'youtube-search-results.p.rapidapi.com',
          'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY || '',
        },
      },
    );
    const body = await response.json();
    return body.items.filter(item => item.type === 'video');
  }, []);

  return {
    searchYouTube,
  };
};
