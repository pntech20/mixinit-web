import { getDiscountApi } from 'app/apis/discount';
import { useEffect, useState } from 'react';

export const useDiscounts = () => {
  const [discountTracks, setDiscountTracks] = useState<any>(null);
  const [discountReleases, setDiscountReleases] = useState<any>(null);

  useEffect(() => {
    const getDiscountTracks = async () => {
      const res = await getDiscountApi('tracks');
      setDiscountTracks(res);
    };
    getDiscountTracks();
  }, []);

  useEffect(() => {
    const getDiscountRelease = async () => {
      const res = await getDiscountApi('releases');
      setDiscountReleases(res);
    };
    getDiscountRelease();
  }, []);

  const getDiscountInfoTrack = (numPurchases: number) => {
    const thresholds = [
      { limit: 20, percentage: 5 },
      { limit: 40, percentage: 10 },
      { limit: 60, percentage: 15 },
      { limit: 80, percentage: 20 },
      { limit: 100, percentage: 25 },
      { limit: 120, percentage: 30 },
      { limit: 140, percentage: 35 },
      { limit: 160, percentage: 40 },
      { limit: 180, percentage: 45 },
      { limit: 200, percentage: 50 },
    ];

    for (const { limit, percentage } of thresholds) {
      if (numPurchases < limit) {
        return {
          moreTrack: limit - numPurchases,
          percentage,
        };
      }
    }

    return {
      moreTrack: 0,
      percentage: 50,
    };
  };

  const getDiscountInfoRelease = (numPurchases: number) => {
    const thresholds = [
      { limit: 5, percentage: 5 },
      { limit: 10, percentage: 10 },
      { limit: 15, percentage: 15 },
      { limit: 25, percentage: 25 },
    ];

    for (const { limit, percentage } of thresholds) {
      if (numPurchases < limit) {
        return {
          moreRelease: limit - numPurchases,
          percentage,
        };
      }
    }

    return {
      moreRelease: 0,
      percentage: 25,
    };
  };

  const getDiscountPercentageTrack = (numPurchases: number) => {
    switch (true) {
      case numPurchases < 20:
        return 0;
      case 20 <= numPurchases && numPurchases < 40:
        return 5;
      case 40 <= numPurchases && numPurchases < 60:
        return 10;
      case 60 <= numPurchases && numPurchases < 80:
        return 15;
      case 80 <= numPurchases && numPurchases < 100:
        return 20;
      case 100 <= numPurchases && numPurchases < 120:
        return 25;
      case 120 <= numPurchases && numPurchases < 140:
        return 30;
      case 140 <= numPurchases && numPurchases < 160:
        return 35;
      case 160 <= numPurchases && numPurchases < 180:
        return 40;
      case 180 <= numPurchases && numPurchases < 200:
        return 45;
      case numPurchases >= 200:
        return 50;
    }
  };

  const getDiscountPercentageRelease = (numPurchases: number) => {
    switch (true) {
      case numPurchases < 5:
        return 0;
      case 5 <= numPurchases && numPurchases < 10:
        return 5;
      case 10 <= numPurchases && numPurchases < 15:
        return 10;
      case 15 <= numPurchases && numPurchases < 20:
        return 15;
      case 20 <= numPurchases && numPurchases < 25:
        return 20;
      case numPurchases >= 25:
        return 25;
    }
  };

  return {
    discountTracks,
    discountReleases,
    getDiscountPercentageTrack,
    getDiscountPercentageRelease,
    getDiscountInfoTrack,
    getDiscountInfoRelease,
  };
};
