import React from 'react';

export function useOnMount(onMount) {
  return React.useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);
}
