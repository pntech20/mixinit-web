import IconAccounting from 'app/assets/svgs/IconSidebar/IconAccounting';
import IconChart from 'app/assets/svgs/IconSidebar/IconChart';
import IconContact from 'app/assets/svgs/IconSidebar/IconContact';
import IconContributors from 'app/assets/svgs/IconSidebar/IconContributors';
import IconHome from 'app/assets/svgs/IconSidebar/IconHome';
import IconLabel from 'app/assets/svgs/IconSidebar/IconLabel';
import IconLogout from 'app/assets/svgs/IconSidebar/IconLogout';
import IconMedia from 'app/assets/svgs/IconSidebar/IconMedia';
import IconMultipacks from 'app/assets/svgs/IconSidebar/IconMultipacks';
import IconSubscriptions from 'app/assets/svgs/IconSidebar/IconSubscriptions';
import IconTracks from 'app/assets/svgs/IconSidebar/IconTracks';
import IconUploader from 'app/assets/svgs/IconSidebar/IconUploader';
import useContributorSubscriptionPool from 'app/hooks/services/useContributorSubscriptionPool';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DropdownLinkItem } from '../DropdownLink';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

interface SideBarItemProps {
  name: string;
  icon: JSX.Element;
  linkTo?: string;
  divide?: JSX.Element;
  type?: string;
  items?: Array<DropdownLinkItem>;
}

export default function useSidebarData() {
  const { isLargerThan1024, isLargerThan780 } = useMediaScreen();
  const { t } = useTranslation();
  const { userDetail } = useSelector(selectAuth);
  const { isConfirmContributor } = useSelector(selectAuth);

  const { isServices, allowToSubscribeSubscription } =
    useContributorSubscriptionPool();

  useEffect(() => {
    allowToSubscribeSubscription();
  }, [allowToSubscribeSubscription]);

  const contributorMenu = useMemo(() => {
    let data = [
      {
        name: t('sidebar.accounting'),
        icon: <IconAccounting />,
        linkTo: '/accounting',
      },
      {
        name: t('sidebar.myMedia'),
        icon: <IconMedia />,
        linkTo: '/my-media',
      },
      {
        name: t('sidebar.uploader'),
        icon: <IconUploader />,
        type: 'DropdownLink',
        linkTo: '/uploader',
      },
      {
        name: "Editor's Guide",
        icon: <IconAccounting />,
        linkTo: 'https://www.crooklynclan.net/ccv4-contributor-onboarding',
      },
      {
        name: 'Ad center',
        icon: <IconAccounting />,
        linkTo: '/ads',
      },
    ];
    return data;
  }, [t]);

  const mainMenu = useMemo(() => {
    const data = [
      {
        name: t('sidebar.home'),
        icon: <IconHome />,
        linkTo: '/home',
      },
      {
        name: t('sidebar.Charts'),
        icon: <IconChart />,
        linkTo: '/charts',
      },
      // {
      //   name: t('sidebar.HowToGuides'),
      //   icon: <IconLabels />,
      //   linkTo: '/how-to-guides',
      // },
      {
        name: t('sidebar.tracks'),
        icon: <IconTracks />,
        linkTo: '/tracks',
      },
      {
        name: 'Multipacks',
        icon: <IconMultipacks />,
        linkTo: '/multipacks',
      },
      {
        name: t('sidebar.contributors'),
        icon: <IconContributors />,
        linkTo: '/contributors',
      },
      {
        name: t('sidebar.labels'),
        icon: <IconLabel />,
        linkTo: '/labels',
      },
      {
        name: t('sidebar.subscriptions'),
        icon: <IconSubscriptions />,
        linkTo: '/services',
      },
      {
        name: t('sidebar.contactUs'),
        icon: <IconContact />,
        linkTo: '/contact-us',
      },
      {
        name: 'Help',
        icon: <IconContact />,
        // linkTo: 'https://www.crooklynclan.net/',
      },
    ];
    let newData = isServices
      ? data
      : data.filter(i => i.name !== 'Subscriptions');
    if (!isLargerThan1024) {
      newData.push({
        name: 'My Library',
        icon: <IconContact />,
        linkTo: '/my-library',
      });
    }
    if (!isLargerThan780) {
      newData = [...newData, ...contributorMenu];
    }
    return newData;
  }, [contributorMenu, isLargerThan1024, isLargerThan780, isServices, t]);

  const bottomMenus = useMemo(() => {
    return [
      {
        type: 'logout',
        name: 'Logout',
        icon: <IconLogout />,
      },
    ];
  }, []);
  const menuList: Array<SideBarItemProps> = useMemo(() => {
    if (userDetail?.isContributor) {
      return [...mainMenu, ...contributorMenu];
    }

    return [...mainMenu, ...bottomMenus];
  }, [bottomMenus, contributorMenu, mainMenu, userDetail?.isContributor]);

  return {
    menuList,
    mainMenu,
    contributorMenu,
    bottomMenus,
    isServices,
    isConfirmContributor,
  };
}
