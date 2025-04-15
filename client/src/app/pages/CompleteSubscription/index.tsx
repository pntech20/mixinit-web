import { useTokenPackages } from 'app/hooks/services/useTokenPackages';
import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const CompleteSubscription = memo(() => {
  const location = useLocation();
  const { handleCompleteSubscription } = useTokenPackages();
  const queryParams = new URLSearchParams(location.search);
  const subscription_id = queryParams.get('subscription_id');

  useEffect(() => {
    if (subscription_id) {
      handleCompleteSubscription(subscription_id);
    }
  }, [location, handleCompleteSubscription, subscription_id]);

  return <></>;
});
