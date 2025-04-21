/* eslint-disable no-lone-blocks */
import {
  Avatar,
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import AvatarDefault from 'app/assets/images/banner/avatar-default.png';
import logoIconBlack from 'app/assets/logo/MIXINIT2.png';
import { formatCash } from 'app/helpers/functions';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import useSidebarData from 'app/layouts/General/components/Sidebar/useSidebarData';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { default as classNames } from 'classnames';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { MdStars } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { CartCheckout } from '../Cart';
import { PopoverTrigger } from './Trigger';
import styles from './header.module.scss';

import { useItemCrate } from 'app/hooks/useItemCrate/useItemCrate';
import { useWishlistsSlice } from 'app/pages/Wishlist/slice';
import './styles.scss';
import { FaFilter, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { MainDrawer } from '../MainDrawer';
interface Props {
  isShowSidebar?: boolean;
  onShowSidebar?: () => void;
}

export function TopMenu({ isShowSidebar, onShowSidebar }: Props) {
  const { actions: actionsWishlist } = useWishlistsSlice();

  const handleShowCart = () => {
    dispatch(actionsWishlist.getWishlistRequest());
    setIsCart(!isCart);
  };

  const { onClear, removeToggleShowFilter } = useTracks();

  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { actions } = useTrackSlice();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLightMode } = useModeTheme();
  const { userDetail } = useSelector(selectAuth);

  const { isLargerThan650, isLargerThan780, isLargerThan425, isLargerThan900 } =
    useMediaScreen();
  const history = useHistory();
  const { myWishlists } = useWishlists();

  const { mainMenu, isServices } = useSidebarData();

  const { onGetMyCrates } = useItemCrate();

  useEffect(() => {
    onGetMyCrates('track');
  }, [onGetMyCrates]);

  const [size, setSize] = useState(0);
  const [isCart, setIsCart] = useState<boolean>(false);

  const isServicesPage = useMemo(() => {
    return pathname.includes('/services');
  }, [pathname]);

  const isTracksPage = pathname.includes('/tracks');
  const isTrackDetailPage = pathname.includes('/tracks/');

  useEffect(() => {
    isServices === false && isServicesPage && history.push('/');
  }, [history, isServices, isServicesPage]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize(window.innerWidth);
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (size <= 500) {
      onClose();
    }
  }, [onClose, size]);

  const listIconMenu = useMemo(() => {
    return userDetail?.starsRemaining > 0
      ? [
          {
            linkTo: '/services',
            icon: (
              <MdStars
                size={isLargerThan780 ? '30px' : '24px'}
                color={isLightMode ? '#000' : '#fff'}
              />
            ),
            price: Number(formatCash(userDetail?.starsRemaining || 0)),
            name: 'star',
          },
        ]
      : [];
  }, [isLargerThan780, isLightMode, userDetail?.starsRemaining]);

  const fullName = useMemo(() => {
    const firstName = userDetail?.firstName ?? '';
    const lastName = userDetail?.lastName ?? '';

    return `${firstName} ${lastName}`.trim();
  }, [userDetail]);

  const subUserInfo = useMemo(() => {
    if (!userDetail) return '';

    return userDetail.username;
  }, [userDetail]);

  const renderNavLink = item => {
    {
      return (
        <NavLink
          activeClassName={classNames([styles.linkActiveDark])}
          className={classNames([styles.menuLinkDark])}
          to={item?.linkTo}
          href={item?.linkTo}
          key={item?.linkTo}
        >
          <Text
            className={classNames([styles.menuLinkDark])}
            p="18px 7px"
            fontWeight="600"
            fontSize={isLargerThan900 ? '16px' : '14px'}
            key={item.name}
            alignItems="center"
            paddingLeft={item?.name === 'Home' ? '0px !important' : 'unset'}
            color={'#fff'}
          >
            {item.name}
          </Text>
        </NavLink>
      );
    }
  };

  const setFilterImage = useCallback(() => {
    if (userDetail?.avatar) {
      return 'unset';
    } else {
      if (!isLightMode) {
        return 'invert(1)';
      } else {
        return 'unset';
      }
    }
  }, [isLightMode, userDetail?.avatar]);

  const bgCart = useColorModeValue('#fff', '#1A202C');

  useEffect(() => {
    if (!isTracksPage) {
      onClear();
      dispatch(actions.addFilterTrack(undefined));
      removeToggleShowFilter();
    }
  }, [
    actions,
    dispatch,
    isTrackDetailPage,
    isTracksPage,
    onClear,
    removeToggleShowFilter,
  ]);

  return (
    <Box className={styles.containerHeader} backgroundColor={'#000'}>
      <Flex
        h="120px"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        m="auto"
      >
        <Box className={styles.left}>
          <a
            href="https://www.crooklynclan.net/"
            target="_blank"
            rel="noreferrer"
          >
            <Image h="100px" color="#747474" src={logoIconBlack} ml="16px" />
          </a>
        </Box>

        <Flex className={styles.right}>
          <Flex className={styles.menu}>
            {mainMenu.map(item => item.linkTo && renderNavLink(item))}
          </Flex>
          <FaFilter fontSize="20px" color="#fff" cursor="pointer" />

          <Box mx="10px" onClick={() => handleShowCart()}>
            <FaShoppingCart fontSize="20px" color="#fff" cursor="pointer" />
          </Box>
          <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <FaUserCircle fontSize="20px" color="#fff" cursor="pointer" />
            </PopoverTrigger>
            <PopoverContent w="250px">
              {userDetail?.isContributor &&
                !userDetail?.needToConfirmContributor && (
                  <PopoverHeader fontWeight="semibold">
                    <Flex className={styles.headerInfoWidget}>
                      <Avatar
                        src={userDetail?.avatar || AvatarDefault}
                        fallbacksrc={AvatarDefault}
                        filter={setFilterImage()}
                        bg="unset"
                        borderRadius="50%"
                        width="32px"
                        height="32px"
                      />
                      <Box className={styles.userInfoWidget}>
                        <Text className={styles.userFullName}>{fullName}</Text>

                        <Text className={styles.userName}>{subUserInfo}</Text>
                        {!isLargerThan425 && (
                          <Flex gridGap="10px" mt="10px">
                            {listIconMenu.map((item, index) => {
                              const isMargin =
                                index !== 1 ? '0px' : '0 10px 0 15px';
                              return (
                                <Link key={index} to={item?.linkTo}>
                                  <Flex
                                    m={isLargerThan650 ? isMargin : 'unset'}
                                    alignItems="center"
                                    cursor="pointer"
                                    display={
                                      item.price === 0 && item.name === 'star'
                                        ? 'none'
                                        : 'flex'
                                    }
                                  >
                                    <Flex mr="5px">{item.icon}</Flex>
                                    <Text fontWeight="bold" fontSize="12px">
                                      {item.price}
                                    </Text>
                                  </Flex>
                                </Link>
                              );
                            })}
                          </Flex>
                        )}
                      </Box>
                    </Flex>
                  </PopoverHeader>
                )}

              <PopoverBody>
                <MainDrawer isOpen={isOpen} onClose={onClose} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
      <Modal isOpen={isCart} onClose={() => setIsCart(false)}>
        <ModalContent
          maxW={{ base: '100%', lg: '80%', xl: '70%' }}
          marginBottom="0px"
        >
          <ModalCloseButton />
          <ModalBody p="0px">
            <Flex bg={bgCart} p="15px">
              <CartCheckout myWishlists={myWishlists} setIsCart={setIsCart} />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
