import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const CompleteOrder = memo(() => {
  const location = useLocation();
  const { handleCompleteOrder } = useWishlists();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (token) {
      handleCompleteOrder(token);
    }
  }, [location, handleCompleteOrder, token]);

  return <></>;
});
