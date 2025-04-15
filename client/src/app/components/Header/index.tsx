/* eslint-disable no-lone-blocks */
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
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
import Cart from 'app/assets/images/header/cart2.svg';
import logoIconLight from 'app/assets/logo/crooklyn-clan-logo-refresh-black.svg';
import logoIconBlack from 'app/assets/logo/crooklyn-clan-logo-refresh.png';
import MyLibrary from 'app/assets/svgs/MyLibrary';
import { formatCash } from 'app/helpers/functions';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useSubscriptions } from 'app/hooks/subscription/useSubscriptions';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import useSidebarData from 'app/layouts/General/components/Sidebar/useSidebarData';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { formatDate } from 'app/utils/date';
import { default as classNames } from 'classnames';
import queryString from 'query-string';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IoMenu } from 'react-icons/io5';
import { MdLightMode, MdStars } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import DarkMode from '../../assets/icons/mode.png';
import { CartCheckout } from '../Cart';
import DropDown from '../Common/Dropdowns';
import { MainDrawer } from '../MainDrawer';
import { PopoverTrigger } from './Trigger';
import styles from './header.module.scss';

import { usePlayers } from 'app/hooks/player/usePlayers';
import { useItemCrate } from 'app/hooks/useItemCrate/useItemCrate';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import { useWishlistsSlice } from 'app/pages/Wishlist/slice';
import './styles.scss';
import { IoMdHeartEmpty } from 'react-icons/io';
interface Props {
  isShowSidebar?: boolean;
  onShowSidebar?: () => void;
}

export function TopMenu({ isShowSidebar, onShowSidebar }: Props) {
  const { showFavoriteByMe } = useSelector(selectSliceTracks);

  const [searchValue, setSearchValue] = useState('');
  const [isActiveMyLibrary, setIsActiveMyLibrary] = useState(false);
  const [isShowNav, setShowNav] = useState(false);

  const { actions: actionsWishlist } = useWishlistsSlice();

  const handleShowCart = () => {
    dispatch(actionsWishlist.getWishlistRequest());
    setIsCart(!isCart);
  };
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const { onClear, removeToggleShowFilter } = useTracks();
  const { searchOptionFillter } = useFilters();

  const { pathname, search } = useLocation();
  const { subscriptions } = useSubscriptions();

  const query = queryString.parse(search);

  const dispatch = useDispatch();
  const { actions } = useTrackSlice();
  const [optionSearch, setOptionSearch] = useState(
    searchOptionFillter[0].value,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLightMode, toggleColorMode } = useModeTheme();
  const { userDetail } = useSelector(selectAuth);

  const {
    isLargerThan650,
    isSmallerThan500,
    isLargerThan1440,
    isLargerThan860,
    isLargerThan780,
    isLargerThan769,
    isLargerThan425,
    isLargerThan1024,
    isLargerThan900,
    isSmallerThan768,
  } = useMediaScreen();
  const history = useHistory();
  const { myWishlists } = useWishlists();
  const { handleInputFocus, handleInputBlur } = usePlayers();

  const { mainMenu, isServices, isConfirmContributor } = useSidebarData();

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
  const isTrackInLabelsDetailPage =
    pathname.includes('/labels/') &&
    (query?.tab === '1' || query?.tab === undefined);
  const isTrackInContributorsDetailPage =
    pathname.includes('/contributors/') &&
    (query?.tab === '1' || query?.tab === undefined);

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

  const handleOnclickFavorite = useCallback(() => {
    if (isTrackInLabelsDetailPage || isTrackInContributorsDetailPage) {
      history.push({
        search: `?tab=1`,
        state: {
          showFavoriteByMe: !showFavoriteByMe,
        },
      });
    } else {
      history.push({
        pathname: `/tracks`,
        state: {
          showFavoriteByMe: isTracksPage ? !showFavoriteByMe : true,
        },
      });
    }
  }, [
    history,
    isTrackInContributorsDetailPage,
    isTrackInLabelsDetailPage,
    isTracksPage,
    showFavoriteByMe,
  ]);

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

  const renderAnotherType = item => {
    return (
      <Text>
        <a
          style={{ fontWeight: '600', fontSize: '16px' }}
          href="https://www.crooklynclan.net/ccv4-how-it-works"
          target="_blank"
          rel="noreferrer"
        >
          Help
        </a>
      </Text>
    );
  };

  const renderNavLink = item => {
    {
      return item.name === "Editor's Guide" ? (
        <a
          href="https://www.crooklynclan.net/ccv4-contributor-onboarding"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: isLargerThan900 ? '16px' : '14px',
            fontWeight: 600,
          }}
        >
          Editor's Guide
        </a>
      ) : (
        <NavLink
          activeClassName={classNames(
            !isLightMode ? [styles.linkActiveDark] : [styles.linkActiveLight],
          )}
          className={classNames(
            !isLightMode ? [styles.menuLinkDark] : [styles.menuLinkLight],
          )}
          to={item?.linkTo}
          href={item?.linkTo}
          key={item?.linkTo}
        >
          <Text
            className={classNames(
              !isLightMode ? [styles.menuLinkDark] : [styles.menuLinkLight],
            )}
            p="18px 7px"
            fontWeight="600"
            fontSize={isLargerThan900 ? '16px' : '14px'}
            key={item.name}
            alignItems="center"
            paddingLeft={item?.name === 'Home' ? '0px !important' : 'unset'}
          >
            {item.name}
          </Text>
        </NavLink>
      );
    }
  };

  const DesktopNav = () => {
    return mainMenu.map(item =>
      // item.linkTo && renderNavLink(item),
      item.linkTo ? renderNavLink(item) : renderAnotherType(item),
    );
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
  const colorText = useColorModeValue('#1a202c', '#fff');

  const handleTokenZero = (token: any) => {
    if (token <= 0) {
      history.push('/services');
    }
  };

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

  const handleChangeFilter = useCallback(e => {
    setOptionSearch(e);
  }, []);

  const handleChangeSearchHome = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleSearchGo = () => {
    history.push({
      pathname: `/${optionSearch}`,
      state: {
        search: searchValue,
      },
    });
    inputSearchRef.current?.blur();
    setSearchValue('');
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSearchGo();
    }
  };

  return (
    <Box
      className={styles.containerHeader}
      backgroundColor={isLightMode ? '#FAFAFA' : '#1c1c1c'}
    >
      <Flex
        h="60px"
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
            {isLightMode ? (
              <Image h="48px" color="#747474" src={logoIconLight} ml="16px" />
            ) : (
              <Image h="48px" src={logoIconBlack} ml="16px" />
            )}
          </a>
        </Box>

        <Flex className={styles.right}>
          {userDetail?.isContributor &&
            isLargerThan780 &&
            !isConfirmContributor && (
              <Box
                alignItems="center"
                gridGap={isLargerThan1024 ? '20px' : '5px'}
              >
                <NavLink
                  activeClassName={classNames(
                    !isLightMode
                      ? [styles.linkActiveDark]
                      : [styles.linkActiveLight],
                  )}
                  className={classNames(
                    !isLightMode
                      ? [styles.menuLinkDark]
                      : [styles.menuLinkLight],
                  )}
                  to={'/contributor-admin'}
                  href={'/contributor-admin'}
                >
                  <Text
                    className={classNames(
                      !isLightMode
                        ? [styles.menuLinkDark]
                        : [styles.menuLinkLight],
                    )}
                    p="18px 7px"
                    fontWeight="600"
                    fontSize={isLargerThan900 ? '16px' : '14px'}
                    alignItems="center"
                    paddingLeft={'unset'}
                  >
                    Contributor Admin
                  </Text>
                </NavLink>
              </Box>
            )}
          {userDetail?.isContributor &&
            isLargerThan860 &&
            !isConfirmContributor && (
              <Box
                m="0px 10px 0px 26px"
                w="1px"
                h="16px"
                bgColor={isLightMode ? '#380e0e' : '#ededed'}
              ></Box>
            )}
          {!isLargerThan1024 && (
            <Flex
              cursor="pointer"
              gridGap="5px"
              alignItems="center"
              onClick={handleOnclickFavorite}
              w="22px"
              justifyContent={'center'}
            >
              {!showFavoriteByMe ? (
                <Box fontSize={18}>
                  {!isLightMode ? '🤍' : <IoMdHeartEmpty size={22} />}
                </Box>
              ) : (
                <Box fontSize={18}>❤️</Box>
              )}
            </Flex>
          )}
          <Button
            aria-label="Toggle Color Mode"
            size="md"
            w="fit-content"
            className={styles.modeBtn}
            mr={
              listIconMenu.length > 0
                ? !isLargerThan425
                  ? '-6px'
                  : '0px'
                : !isLargerThan900
                ? '-5px'
                : '-15px'
            }
          >
            <Box onClick={toggleColorMode}>
              {isLightMode ? (
                // <MdDarkMode
                //   size={isLargerThan769 ? '40px' : '30px'}
                //   color="#000"
                // />
                <Image
                  src={DarkMode}
                  w={isLargerThan780 ? '25px' : '20px'}
                  h={isLargerThan780 ? '25px' : '20px'}
                />
              ) : (
                <MdLightMode size={isLargerThan780 ? '25px' : '20px'} />
              )}
            </Box>
          </Button>

          {isLargerThan425 &&
            listIconMenu.map((item, index) => {
              const isMargin = index !== 1 ? '0px' : '0 0 0 10px';
              return (
                <Link key={index} to={item.name !== 'star' && item?.linkTo}>
                  <Flex
                    p={isMargin}
                    alignItems="center"
                    cursor={item.name === 'star' ? 'default' : 'pointer'}
                    onClick={() => handleTokenZero(item.price)}
                    display={
                      item.price === 0 && item.name === 'star' ? 'none' : 'flex'
                    }
                    _hover={{
                      color: item.name === 'star' && colorText,
                    }}
                  >
                    <Flex mx="5px">{item.icon}</Flex>
                    <Text
                      fontWeight="bold"
                      fontSize={isLargerThan780 ? '16px' : '14px'}
                    >
                      {item.price}
                    </Text>
                  </Flex>
                </Link>
              );
            })}
          <Box mx="10px" onClick={() => handleShowCart()}>
            <Flex alignItems="center" cursor="pointer">
              <Image
                filter={isLightMode ? 'unset' : 'invert(1)'}
                w={isLargerThan780 ? '25px' : '20px'}
                h={isLargerThan780 ? '25px' : '20px'}
                src={Cart}
                mx="5px"
              />
              {myWishlists?.length > 0 && (
                <Text
                  fontWeight="bold"
                  fontSize={isLargerThan780 ? '16px' : '14px'}
                  mr="5px"
                >
                  {myWishlists?.length || 0}
                </Text>
              )}
            </Flex>
          </Box>
          <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <IconButton
                className={styles.iconButton}
                aria-label="close"
                icon={
                  <Avatar
                    width={isLargerThan769 ? '35px' : '30px'}
                    height={isLargerThan769 ? '35px' : '30px'}
                    filter={setFilterImage()}
                    bg="unset"
                    cursor="pointer"
                    src={userDetail?.avatar}
                    fallbacksrc={AvatarDefault}
                    mr={isLargerThan650 ? '16px' : '12px'}
                    size="15px"
                    backgroundColor="#1A202C"
                  />
                }
              />
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
      {isLargerThan1024 && (
        <Box bgColor="#292929">
          <Box maxW="1440px" margin="auto">
            <Flex
              className={styles.containerMenuHeader}
              alignItems="center"
              justifyContent="space-between"
              padding={
                isLargerThan1440
                  ? '0px'
                  : isLargerThan860
                  ? '0px 26px'
                  : isSmallerThan500
                  ? '0px 5px'
                  : '0px 16px'
              }
            >
              <Flex className={styles.menuContent}>{DesktopNav()}</Flex>
              <Flex alignItems="center" gridGap="15px">
                <Flex
                  cursor="pointer"
                  gridGap="5px"
                  alignItems="center"
                  onClick={handleOnclickFavorite}
                >
                  {!showFavoriteByMe ? (
                    <Box fontSize={18}>🤍</Box>
                  ) : (
                    <Box fontSize={18}>❤️</Box>
                  )}
                </Flex>
                <Flex
                  cursor="pointer"
                  gridGap="5px"
                  alignItems="center"
                  onMouseEnter={() => setIsActiveMyLibrary(true)}
                  onMouseLeave={() => setIsActiveMyLibrary(false)}
                  onClick={() => {
                    history.push('/my-library');
                  }}
                >
                  <MyLibrary
                    fill={
                      pathname === '/my-library' || isActiveMyLibrary
                        ? '#0082f3'
                        : '#fff'
                    }
                  />
                  <Text
                    color={
                      pathname === '/my-library' || isActiveMyLibrary
                        ? '#0082f3'
                        : '#fff'
                    }
                    fontSize={16}
                    fontWeight={600}
                  >
                    My Library
                  </Text>
                </Flex>
                {/* <Box
                  onMouseEnter={() => setIsActiveMyCrate(true)}
                  onMouseLeave={() => setIsActiveMyCrate(false)}
                >
                  <MyCrate color={isActiveMyCrate ? '#0082f3' : '#fff'} />
                </Box> */}
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}
      <Box backgroundColor="#292929" padding="5px 20px 5px 15px">
        <Flex maxWidth="1440px" margin="auto" gridGap="7px" alignItems="center">
          <Box id="search" width="100%">
            <Input
              ref={inputSearchRef}
              width="100%"
              pr="5.2rem"
              color="#fff"
              placeholder="Search..."
              _placeholder={{ color: '#d4d4d4' }}
              value={searchValue}
              onKeyPress={handleKeyPress}
              onChange={handleChangeSearchHome}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </Box>
          <DropDown
            color="#fff"
            width="130px"
            filters={searchOptionFillter}
            handleChangeDropDown={handleChangeFilter}
            name="sort"
            value={optionSearch}
          />
          {!isLargerThan1024 && (
            <IoMenu
              onClick={() => setShowNav(!isShowNav)}
              color={isShowNav ? '#0481f3' : 'white'}
              fontSize="25px"
              cursor="pointer"
            />
          )}
        </Flex>
        {subscriptions && (
          <Flex
            w="100%"
            gridGap="5px"
            justifyContent="center"
            mt="5px"
            display={isSmallerThan768 ? 'block' : 'flex'}
          >
            <Flex justifyContent="center">
              <Text className={styles.upgradeLink} whiteSpace="nowrap">
                {subscriptions.packageName}
              </Text>
            </Flex>
            <Flex gridGap="5px" justifyContent="center">
              <Text className={styles.textInfoSubs}>
                Start:{' '}
                <span className={styles.textInfoValueSubs}>
                  {formatDate(subscriptions?.dateStart || '')}
                </span>
              </Text>
              <Text className={styles.textInfoSubs}>
                End:{' '}
                <span className={styles.textInfoValueSubs}>
                  {formatDate(subscriptions?.dateEnd || '')}
                </span>
              </Text>
              <Text className={styles.textInfoSubs}>
                DL's:{' '}
                <span className={styles.textInfoValueSubs}>
                  {subscriptions?.downloaded}
                </span>
              </Text>
              <Text className={styles.textInfoSubs}>
                Remaining:{' '}
                <span className={styles.textInfoValueSubs}>
                  {subscriptions?.remaining}
                </span>
              </Text>
              <Text
                className={styles.upgradeLink}
                whiteSpace="nowrap"
                cursor="pointer"
                onClick={() => history.push('/services')}
              >
                Upgrade!
              </Text>
            </Flex>
          </Flex>
        )}
        {isShowNav && (
          <Box
            transition="all, transform 400ms"
            transform="translateY(0px) translateX(0px)"
          >
            {mainMenu.map(menu => (
              <Link to={menu.linkTo} onClick={() => setShowNav(false)}>
                <Box
                  textAlign="right"
                  padding="15px 0px 15px 20px"
                  fontSize="14px"
                  fontWeight={600}
                  color={
                    menu?.linkTo && pathname.includes(menu.linkTo)
                      ? '#0481f3'
                      : '#fff'
                  }
                >
                  {menu.name}
                </Box>
              </Link>
            ))}
          </Box>
        )}
      </Box>
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
