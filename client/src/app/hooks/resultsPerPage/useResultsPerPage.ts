import { useState, useEffect } from 'react';

export const useResultsPerPage = () => {
  const [perPageLocalStorage, setPerPageLocalStorage] = useState(() => {
    return localStorage.getItem('resultsPerPage') || '';
  });
  useEffect(() => {
    const handleStorageChange = () => {
      setPerPageLocalStorage(localStorage.getItem('resultsPerPage') || '');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { perPageLocalStorage: +perPageLocalStorage || 20 };
};
