import IconAccounting from 'app/assets/svgs/IconSidebar/IconAccounting';
import IconChart from 'app/assets/svgs/IconSidebar/IconChart';
import IconContact from 'app/assets/svgs/IconSidebar/IconContact';
import IconContributors from 'app/assets/svgs/IconSidebar/IconContributors';
import IconHome from 'app/assets/svgs/IconSidebar/IconHome';
import IconLogout from 'app/assets/svgs/IconSidebar/IconLogout';
import IconMedia from 'app/assets/svgs/IconSidebar/IconMedia';
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
        name: 'TOP 100',
        icon: <IconChart />,
        linkTo: '/charts',
      },
      {
        name: t('sidebar.contributors'),
        icon: <IconContributors />,
        linkTo: '/contributors',
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
