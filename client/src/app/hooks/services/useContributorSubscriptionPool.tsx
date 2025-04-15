import { contributorSubscriptionPool } from 'app/apis/contributorSubscriptionPool';
import { useCallback, useState } from 'react';

export default function useContributorSubscriptionPool() {
  const [isServices, setIsServices] = useState<boolean>();
  const [subscriptionPool, setSubscriptionPool] = useState<any>(null);

  const allowToSubscribeSubscription = useCallback(async () => {
    const data: any = await contributorSubscriptionPool();
    setIsServices(data.allowToSubscribeSubscription);
    setSubscriptionPool(data);
  }, []);

  const getSubscriptionPool = useCallback(async () => {
    const data: any = await contributorSubscriptionPool();
    setSubscriptionPool(data);
  }, []);

  return {
    allowToSubscribeSubscription,
    isServices,
    getSubscriptionPool,
    subscriptionPool,
  };
}
