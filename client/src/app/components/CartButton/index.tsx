import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { getLocalStorage } from 'app/helpers/local-storage';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import { Release, Track } from 'app/models';
import { isEmpty } from 'ramda';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GiCheckMark } from 'react-icons/gi';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdStars } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import RenderAlertDialog from './RenderAlertDialog';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useSubscriptions } from 'app/hooks/subscription/useSubscriptions';
import { BsCartPlusFill, BsFillCartDashFill } from 'react-icons/bs';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
interface CartButtonProps {
  track?: Track | undefined;
  release?: Release | undefined;
  width?: string;
  height?: string;
  isRelease?: boolean;
  isReleaseDetail?: boolean;
  isChartsPage?: boolean;
  updateWishlistStatus?: any;
  updateWishlistStatusForTopRelease?: any;
  handleOpenBuyTrack?: any;
}

export default function CartButton({
  track,
  isRelease = false,
  release,
  isReleaseDetail = false,
  isChartsPage = false,
  updateWishlistStatus,
  updateWishlistStatusForTopRelease,
  handleOpenBuyTrack,
}: CartButtonProps) {
  const {
    handleAddTrackToWishlist,
    onOpen,
    isOpen,
    onClose,
    isShowModalMessageRemove,
    onOpenModalMessageRemove,
    onCloseModalMessageRemove,
    handleRemoveTrackToWishlist,
    handleAddReleaseToWishlist,
    handleRemoveReleaseToMyWishlist,
    userDetail,
    buyTrackByStar,
    isShowModalBuyTrackByStar,
    onOpenModalBuyTrackByStar,
    onCloseModalBuyTrackByStar,
    isLoadingBuyTrack,
    myWishlists,
    isShowModalTrackBelongRelease,
    onOpenModalTrackBelongRelease,
    onCloseModalTrackBelongRelease,
    isAddedTracksOrRelease,
    addedTrackIdOrReleaseId,
  } = useWishlists();
  const { isDarkMode } = useModeTheme();

  const [tracks, setTracks] = useState<number>(0);

  const {
    isOpen: isShowModalTrack,
    onOpen: onOpenModalTrack,
    onClose: onCloseModalTrack,
  } = useDisclosure();

  const openModal = trackId => {
    updateWishlistStatus
      ? handleOpenBuyTrack(trackId)
      : onOpenModalBuyTrackByStar();
  };

  const { subscriptions } = useSubscriptions();

  const isBuyWithSubscription = useMemo(() => {
    const existedLabel =
      Number(subscriptions?.remaining) > 0 &&
      subscriptions?.labelsIncluded?.includes(track?.label?._id || '');

    return !!existedLabel;
  }, [
    subscriptions?.remaining,
    subscriptions?.labelsIncluded,
    track?.label?._id,
  ]);

  const { t } = useTranslation();

  const releasesCart = myWishlists.filter(i => i.type === 'release');
  const isCheckTrackBelongRelease = releasesCart
    .map((c: any) => c?.release.tracks.map(tr => tr._id))
    .flat();

  const handShowModalTrackBelongRelease = () => {
    const tracksCart = (myWishlists || [])
      .filter(i => i?.type === 'track')
      .map(i => i?.track?._id);

    const trackBelongRelease = release?.tracks.map((tr: any) => tr._id);

    const listtrack = tracksCart.filter(tr =>
      (trackBelongRelease || []).includes(tr),
    );

    if (listtrack.length > 0) {
      setTracks(listtrack.length);
      onOpenModalTrack();
      onClose();
    } else {
      handleAddReleaseToWishlist(release?._id);
      if (isChartsPage)
        updateWishlistStatusForTopRelease(
          release?._id,
          release?.isBelongMyWishlist,
        );
      onCloseModalTrack();
    }
  };

  const { pathname } = useLocation();
  const history = useHistory();

  const isTrack = pathname.split('/')?.[1] === 'tracks';

  const handleMyLibrary = () => {
    history.push('/my-library');
  };

  const handleTrackOfRelease = useCallback(tracks => {
    return tracks.every((tr: any) => tr.boughtByMe);
  }, []);

  const isShowMessageAddStorage = getLocalStorage('isShowMessageAdd');
  const isShowMessageRemoveStorage = getLocalStorage('isShowMessageRemove');
  const isShowMessageAdd = isEmpty(isShowMessageAddStorage)
    ? true
    : isShowMessageAddStorage;
  const isShowMessageRemove = isEmpty(isShowMessageRemoveStorage)
    ? true
    : isShowMessageRemoveStorage;

  const { isUseInput } = usePlayers();

  const handleKeyPress = useCallback(
    event => {
      const { key } = event;
      if (!isUseInput) {
        if (['Backspace'].includes(key)) {
          isOpen && onClose();
        }
        if (['Enter'].includes(key) && isOpen) {
          handleAddTrackToWishlist(track?._id);
          onClose();
        }
      }
    },
    [handleAddTrackToWishlist, isOpen, isUseInput, onClose, track?._id],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (isBuyWithSubscription || (isRelease && release?.isMyRelease))
    return <></>;

  return (
    <>
      <Box>
        {(isRelease &&
          (release?.boughtByMe || release?.totalUnBuyTracks === 0)) ||
        track?.boughtByMe ||
        (isRelease && handleTrackOfRelease(release?.tracks)) ? (
          <Tooltip
            hasArrow
            label={
              track?.boughtByMe
                ? 'You have already purchased this track'
                : release?.isBuyAllTrackOfRelease
                ? 'You have already purchased all the tracks inside of this multipack'
                : 'You have already purchased this release'
            }
            bg="gray.300"
            color="black"
          >
            <Flex
              color="#000"
              cursor="pointer"
              borderRadius={
                isRelease ? (isReleaseDetail ? '20px' : '5px') : '20px'
              }
              alignItems="center"
              padding="4px 5px"
              h={isRelease ? (isReleaseDetail ? '30px' : '26px') : '30px'}
              w="35px"
              onClick={() => isTrack && handleMyLibrary()}
            >
              <GiCheckMark color="#00ff3c" size={23} />
            </Flex>
          </Tooltip>
        ) : track?._id && userDetail?.starsRemaining > 0 ? (
          <Flex
            w="max-content"
            gridGap="5px"
            color={'#fff'}
            cursor="pointer"
            borderRadius="50%"
            alignItems="center"
            h={'30px'}
            onClick={() => openModal(track?._id)}
          >
            <MdStars
              size={'20px'}
              color={'#fff'}
              style={{ background: '#000', borderRadius: '50%' }}
            />
          </Flex>
        ) : isAddedTracksOrRelease &&
          addedTrackIdOrReleaseId === (track?._id || release?._id) ? (
          <Spinner size="sm" color={'#fff'} />
        ) : (
          <Button
            variant="unstyled"
            cursor="pointer"
            h="20px"
            onClick={() => {
              if (!isRelease) {
                if (!track?.isBelongMyWishlist) {
                  // if (isChartsPage) {
                  //   console.log('11111111');

                  //   history.push({
                  //     state: {
                  //       isBelongMyWishlist: true,
                  //     },
                  //   });
                  // }
                  if (isCheckTrackBelongRelease.includes(track?._id))
                    return onOpenModalTrackBelongRelease();
                  if (isShowMessageAdd) return onOpen();
                  handleAddTrackToWishlist(track?._id);
                  if (isChartsPage) {
                    updateWishlistStatus(track?._id, track?.isBelongMyWishlist);
                  }
                } else {
                  if (isShowMessageRemove) return onOpenModalMessageRemove();
                  handleRemoveTrackToWishlist([track?._id]);
                  if (isChartsPage) {
                    updateWishlistStatus(track?._id, track?.isBelongMyWishlist);
                  }
                }
              } else {
                if (!release?.isBelongMyWishlist) {
                  if (isShowMessageAdd) return onOpen();
                  handShowModalTrackBelongRelease();
                  // handleAddReleaseToWishlist(release?._id);
                  // if (isChartsPage) {
                  //   updateWishlistStatusForTopRelease(
                  //     release?._id,
                  //     release?.isBelongMyWishlist,
                  //   );
                  // }
                } else {
                  if (isShowMessageRemove) return onOpenModalMessageRemove();
                  handleRemoveReleaseToMyWishlist([release?._id]);
                  if (isChartsPage) {
                    updateWishlistStatusForTopRelease(
                      release?._id,
                      release?.isBelongMyWishlist,
                    );
                  }
                }
              }
            }}
          >
            <RenderAlertDialog
              onClick={() => {
                if (!isRelease) {
                  handleAddTrackToWishlist(track?._id);
                  if (isChartsPage) {
                    updateWishlistStatus(track?._id, track?.isBelongMyWishlist);
                  }
                } else {
                  handShowModalTrackBelongRelease();
                }
              }}
              isOpen={isOpen}
              onClose={onClose}
              title="ADD TO CART?"
              content={
                !isRelease
                  ? 'Are you sure you want to add this track to the cart?'
                  : 'Add Product To Cart?'
              }
              name="isShowMessageAdd"
              isShowCheckbox
            />
            <RenderAlertDialog
              onClick={() => {
                if (!isRelease) {
                  handleRemoveTrackToWishlist([track?._id]);
                  if (isChartsPage) {
                    updateWishlistStatus(track?._id, track?.isBelongMyWishlist);
                  }
                } else {
                  handleRemoveReleaseToMyWishlist([release?._id]);
                  if (isChartsPage)
                    updateWishlistStatusForTopRelease(
                      release?._id,
                      release?.isBelongMyWishlist,
                    );
                }
              }}
              isOpen={isShowModalMessageRemove}
              onClose={onCloseModalMessageRemove}
              title="REMOVE FROM CART?"
              content="Are you sure you want to remove this track from the cart?"
              name="isShowMessageRemove"
              isShowCheckbox
            />
            <Tooltip
              hasArrow
              label={
                track?.isBelongMyWishlist || release?.isBelongMyWishlist
                  ? 'remove from cart'
                  : 'add to cart'
              }
              bg="gray.300"
              color="black"
            >
              <Flex
                w="max-content"
                gridGap="5px"
                cursor="pointer"
                borderRadius={
                  !track?.isBelongMyWishlist
                    ? '5px'
                    : isRelease
                    ? isReleaseDetail
                      ? '20px'
                      : '5px'
                    : '20px'
                }
                alignItems="center"
                padding="4px 5px"
                h={isRelease ? (isReleaseDetail ? '20px' : '20px') : '20px'}
              >
                {track?.isBelongMyWishlist || release?.isBelongMyWishlist ? (
                  <Box>
                    <IoIosCheckmarkCircleOutline size="21.4px" color={'#fff'} />
                  </Box>
                ) : (
                  <Text
                    fontSize="12px"
                    fontWeight={700}
                    textAlign="end"
                    color={'#fff'}
                  >
                    ${track?.price?.toFixed(2) || release?.price?.toFixed(2)}
                  </Text>
                )}
                <Box mb="2px">
                  {track?.isBelongMyWishlist || release?.isBelongMyWishlist ? (
                    <BsFillCartDashFill size="18px" color={'#fff'} />
                  ) : (
                    <BsCartPlusFill size="18px" color={'#fff'} />
                  )}
                </Box>
              </Flex>
            </Tooltip>
          </Button>
        )}
      </Box>
      <Modal isOpen={isShowModalTrack} onClose={() => onCloseModalTrack()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('buyTrack.confirm')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {tracks} tracks are included in this multipack that are already in
              your cart and will be removed
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handleAddReleaseToWishlist(release?._id);
                if (isChartsPage)
                  updateWishlistStatusForTopRelease(
                    release?._id,
                    release?.isBelongMyWishlist,
                  );
                onCloseModalTrack();
              }}
              variant="ghost"
            >
              YES
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isShowModalBuyTrackByStar}
        onClose={() => onCloseModalBuyTrackByStar()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('buyTrack.confirm')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t('buyTrack.useStar', { price: 1 })}</ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoadingBuyTrack}
              onClick={() => buyTrackByStar(track?._id)}
              variant="ghost"
            >
              {t('buyTrack.continue')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isShowModalTrackBelongRelease}
        onClose={() => onCloseModalTrackBelongRelease()}
      >
        <ModalContent>
          <ModalHeader>
            This track belongs to one of the releases you are purchasing
          </ModalHeader>
          <ModalFooter>
            <Button
              bg="#EDF2F7"
              color="#1A202C"
              onClick={() => onCloseModalTrackBelongRelease()}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
