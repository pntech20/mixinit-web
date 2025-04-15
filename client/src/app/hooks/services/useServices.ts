import defaultServicesTokensBanner from 'app/assets/banners/tokens.png';
import defaultServicesSubsBanner from 'app/assets/banners/services_subs.png';
import defaultServicesAVSlotsBanner from 'app/assets/banners/services_av_slots.png';
import { BANNER_PAGE, SERVICES_TYPE } from 'app/constants/enum';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBanners } from '../banners/useBanners';
import { useHistory } from 'react-router-dom';

export const useServices = () => {
  const history = useHistory();

  const [tabIndex, setTabIndex] = useState<SERVICES_TYPE>(
    SERVICES_TYPE.TOKEN_PLANS,
  );

  const setCurrentTab = useCallback(
    (tab: SERVICES_TYPE) => {
      setTabIndex(tab);
      history.push(`?tab=${tab}`);
    },
    [history],
  );

  const options = ['TIERS', 'TOKENS', 'A/V SLOTS'];
  const { banners } = useBanners();

  const [serviceTokensBanner, setServiceTokensBanner] = useState(
    defaultServicesTokensBanner,
  );
  const [serviceSubsBanner, setServiceSubsBanner] = useState(
    defaultServicesSubsBanner,
  );
  const [serviceAVSlotsBanner, setServiceAVSlotsBanner] = useState(
    defaultServicesAVSlotsBanner,
  );

  useEffect(() => {
    const subsImg = banners.find(
      item => item.page === BANNER_PAGE.SERVICES_SUBS,
    );
    const tokenImg = banners.find(
      item => item.page === BANNER_PAGE.SERVICES_TOKENS,
    );
    const avSlotsImg = banners.find(
      item => item.page === BANNER_PAGE.SERVICES_AVSLOTS,
    );

    if (subsImg) {
      setServiceSubsBanner(subsImg?.url);
    }

    if (tokenImg) {
      setServiceTokensBanner(tokenImg?.url);
    }

    if (avSlotsImg) {
      setServiceAVSlotsBanner(avSlotsImg?.url);
    }
  }, [banners]);

  const banner = useMemo(() => {
    let title = 'A/V Slots';
    let description =
      'Add more monthly products to your CrooklynClan Subscription Tier!';
    let bgImg = serviceAVSlotsBanner;
    let className = 'av-slots-banners';

    if (tabIndex === SERVICES_TYPE.TOKEN_PLANS) {
      title = 'Token Packages';
      description = 'CrooklynClan Tokens are the currency.';
      bgImg = serviceTokensBanner;
      className = 'token-banners';
    }

    if (tabIndex === SERVICES_TYPE.SUBSCRIPTION_TIERS) {
      title = 'Tiers';
      description = 'Get just the plan you need!';
      bgImg = serviceSubsBanner;
      className = 'subs-banners';
    }

    return {
      bgImg,
      title,
      description,
      classname: className,
    };
  }, [serviceAVSlotsBanner, serviceSubsBanner, serviceTokensBanner, tabIndex]);

  return { options, tabIndex, banner, setCurrentTab };
};
