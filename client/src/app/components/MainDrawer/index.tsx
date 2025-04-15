import {
  Flex,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import MenuTransactions from 'app/assets/images/menuIcon/check.png';
import MenuLogout from 'app/assets/images/menuIcon/menuLogout.png';
import MenuProfile from 'app/assets/images/menuIcon/menuProfile.png';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useAuthSlice } from 'app/pages/Login/slice';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import classNames from 'classnames';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ChangePassword from '../AccountSettings/components/ChangePassword';
import styles from './index.module.scss';

interface DrawerItem {
  name: string;
  linkTo: string;
  img: string;
}

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MainDrawer({ isOpen = false, onClose }: Props) {
  const onOpenChangePass = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { t } = useTranslation();
  const { isDarkMode } = useModeTheme();
  const { userDetail } = useSelector(selectAuth);

  const isContributor = useMemo(() => {
    return userDetail?.isContributor;
  }, [userDetail]);

  const dispatch = useDispatch();
  const { actions } = useAuthSlice();

  const handleLogout = useCallback(() => {
    dispatch(actions.logout());
  }, [actions, dispatch]);

  const borderBottom = isDarkMode
    ? '1px solid rgb(255, 255, 255, 0.2)'
    : '1px solid rgb(128, 128, 128, 0.2)';

  const ContributorDrawerItems: Array<DrawerItem> = useMemo(
    () => [
      {
        img: MenuProfile,
        name: t('header.myProfile'),
        linkTo: `/account-setting`,
      },
    ],
    [t],
  );

  const drawerItems: Array<DrawerItem> = useMemo(
    () => [
      // {
      //   img: MenuPurchases,
      //   name: t('header.myLibrary'),
      //   linkTo: '/my-library',
      // },
      // {
      //   img: MenuPurchases,
      //   name: t('header.myLibrary'),
      //   linkTo: '/purchase-library',
      // },
      {
        img: MenuTransactions,
        name: t('header.my-transactions'),
        linkTo: '/my-transactions',
      },
      {
        img: MenuLogout,
        name: t('header.logout'),
        linkTo: 'logout',
      },
    ],
    [t],
  );

  const renderItem = (item: DrawerItem) => {
    return (
      <>
        <Image pr="15px" alt="icon" h="26px" src={item.img} />
        <Text fontSize="15px">{item.name}</Text>
      </>
    );
  };

  const newdRawerItems = isContributor
    ? ContributorDrawerItems.concat(drawerItems)
    : drawerItems;

  const renderBody = () => {
    return newdRawerItems.map((item, index) => {
      const isLastItemOfFirstWidget = index === 6;
      if (item.linkTo === 'logout') {
        return (
          <Flex
            key={index}
            className={styles.drawerItem}
            onClick={handleLogout}
          >
            {renderItem(item)}
          </Flex>
        );
      }
      return (
        <NavLink
          onClick={onClose}
          to={item.linkTo}
          key={`${item.linkTo}-${index}`}
        >
          <Flex
            className={classNames(styles.drawerItem, {
              [styles.divider]: isLastItemOfFirstWidget,
            })}
            borderBottom={isLastItemOfFirstWidget ? borderBottom : ''}
          >
            {renderItem(item)}
          </Flex>
        </NavLink>
      );
    });
  };

  return (
    <>
      {!isContributor &&
        !userDetail?.isRegisteredWithFacebook &&
        !userDetail?.isRegisteredWithGoogle &&
        !userDetail?.isRegisteredWithDropbox && (
          <Flex
            className={classNames(styles.drawerItem)}
            onClick={onOpenChangePass.onOpen}
          >
            <Image pr="15px" h="26px" alt="icon" src={MenuProfile} />
            <Text fontSize="15px">Change Password</Text>
          </Flex>
        )}

      {renderBody()}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={onOpenChangePass.isOpen}
        onClose={onOpenChangePass.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ChangePassword onClose={onOpenChangePass.onClose} />
        </ModalContent>
      </Modal>
    </>
  );
}
