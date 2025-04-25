import {
  Box,
  Flex,
  Image,
  Modal,
  Text,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
} from '@chakra-ui/react';
import styles from './cart.module.scss';
import { Wishlist } from 'app/models';
import { useMemo, useState } from 'react';
import { TracksCart } from './tracksCart';
import { ReleasesCart } from './releasesCart';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useDiscounts } from 'app/hooks/discount/useDiscount';
import logoIconLight from 'app/assets/logo/MIXINIT2.png';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import { PayPalButton } from 'react-paypal-button-v2';
import { getLocalStorage } from 'app/helpers/local-storage';
import { COUNTRY, IP_ADDRESS } from 'app/constants';
import Empty from '../Empty';
import { sendSlack } from 'app/apis/track';
import { SLACK_CHANNELS } from 'app/constants/enum';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useSelector } from 'react-redux';
import { handleCreateOrder } from 'app/apis/wishlist';
import { toastError } from 'app/helpers/toast';
interface Props {
  myWishlists?: Wishlist[];
  setIsCart?: (e: boolean) => void;
}

export function CartCheckout({ myWishlists = [], setIsCart }: Props) {
  const { isLightMode } = useModeTheme();
  const [viewTrack, setViewTrack] = useState(false);
  const [viewRelease, setViewRelease] = useState(false);
  const { userDetail } = useSelector(selectAuth);
  const [isLoadingCreateOrder, setIsLoadingCreateOrder] = useState(false);
  const {
    discountTracks,
    discountReleases,
    getDiscountPercentageTrack,
    getDiscountPercentageRelease,
    getDiscountInfoTrack,
    getDiscountInfoRelease,
  } = useDiscounts();

  const {
    isShowModalPaypalCheckout,
    onCloseModalPaypalCheckout,
    onCheckoutSuccess,
    isLoadingWishlist,
  } = useWishlists();

  const tracksCart = myWishlists.filter(i => i.type === 'track');
  const releasesCart = myWishlists.filter(i => i.type === 'release');
  const discountInfoTrack = getDiscountInfoTrack(tracksCart.length);
  const discountInfoRelease = getDiscountInfoRelease(releasesCart.length);

  const discountPercentageTrack = useMemo(() => {
    return getDiscountPercentageTrack(tracksCart?.length);
  }, [getDiscountPercentageTrack, tracksCart?.length]);

  const discountTrack = useMemo(() => {
    if (discountTracks?.isDiscount) {
      return discountTracks?.discountOverride;
    }
    return discountPercentageTrack || 0;
  }, [
    discountTracks?.discountOverride,
    discountTracks?.isDiscount,
    discountPercentageTrack,
  ]);

  const handleCreateOrderApi = async () => {
    try {
      if (userDetail?.isPendingPayment) {
        toastError(
          'You have one pending order. Please check your Paypal transaction and get it completed.',
        );
        return;
      }
      setIsLoadingCreateOrder(true);
      const res = await handleCreateOrder();
      if (res.links && res.links.length > 0) {
        const paypalUrls = res.links;
        const approveUrlPaypal = paypalUrls?.find(
          (url: any) => url?.rel === 'payer-action',
        );
        setIsLoadingCreateOrder(false);
        window.location.assign(approveUrlPaypal?.href);
        return;
      }
    } catch (error) {
      setIsLoadingCreateOrder(false);
      toastError('Create order failed');
    }
  };

  const discountPercentageRelease = useMemo(() => {
    return getDiscountPercentageRelease(releasesCart?.length);
  }, [getDiscountPercentageRelease, releasesCart?.length]);

  const discountRelease = useMemo(() => {
    if (discountReleases?.isDiscount) {
      return discountReleases?.discountOverride;
    }
    return discountPercentageRelease || 0;
  }, [
    discountReleases?.discountOverride,
    discountReleases?.isDiscount,
    discountPercentageRelease,
  ]);

  let totalPriceTrack = 0;
  for (let i = 0; i < tracksCart.length; i++) {
    totalPriceTrack += tracksCart[i]?.track?.price || 0;
  }

  const totalPriceTrackAfterFee = totalPriceTrack;
  const totalPriceTrackAfterDiscount =
    totalPriceTrackAfterFee * (1 - +discountTrack / 100);
  const totalSaveTrack = totalPriceTrack - totalPriceTrackAfterDiscount;

  let totalPriceRelease = 0;
  for (let i = 0; i < releasesCart.length; i++) {
    totalPriceRelease += releasesCart[i]?.release?.price || 0;
  }

  const totalPriceReleaseAfterFee = totalPriceRelease;
  const totalPriceReleaseAfterDiscount =
    totalPriceReleaseAfterFee * (1 - +discountRelease / 100);
  const totalSaveRelease = totalPriceRelease - totalPriceReleaseAfterDiscount;
  const totalPriceCheckout = (
    totalPriceTrackAfterDiscount + totalPriceReleaseAfterDiscount
  ).toFixed(2);

  const isData = tracksCart.length > 0 || releasesCart.length > 0;

  const createOrder = (_, actions) => {
    const userId = userDetail?._id;
    const totalCost = totalPriceCheckout;
    const trackCost = totalPriceTrackAfterDiscount;
    const releaseCost = totalPriceReleaseAfterDiscount;
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalPriceCheckout, // The total price of the order
          },
          custom_id: `${userId}|${totalCost}|${trackCost}|${releaseCost}|${discountTrack}|${discountRelease}`,
          description: `CCv4: Payment from UserId ${userId}`,
        },
      ],
    });
  };

  const payPalSuccess = async (details: any) => {
    const paypalTransactionId =
      details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || '';
    const data = {
      type: 'all',
      paypalTransactionId,
      status: details?.status,
      paypalEmail: details?.payer?.email_address,
      trackDiscount: discountTrack,
      releaseDiscount: discountRelease,
      trackCost: totalPriceTrackAfterDiscount,
      releaseCost: totalPriceReleaseAfterDiscount,
      totalCost: totalPriceCheckout,
      ipAddress: getLocalStorage(IP_ADDRESS),
      country: getLocalStorage(COUNTRY),
      discountRelease,
      discountTrack,
    };
    await sendSlack({
      text: '💰 1. PayPal Success',
      block: '💰 1. PayPal Success',
      channelId: SLACK_CHANNELS.SALES,
      attachments: [
        `*Paypal Transaction ID*: ${data.paypalTransactionId}`,
        `*Paypal Email*: ${data.paypalEmail}`,
        `*Status*: ${data.status}`,
      ],
    });
    onCheckoutSuccess(data);
    setIsCart && setIsCart(false);
  };

  return (
    <Box className={styles.container} bg={'#1A202C'} pb="20px">
      <Flex justifyContent="center">
        <Image width="20%" color="#747474" src={logoIconLight} ml="16px" />
      </Flex>
      <Text
        textAlign="center"
        fontWeight={700}
        fontSize="42px"
        fontFamily={{ base: 'system-ui', md: 'Rubik80sFade' }}
        color={'white'}
      >
        MY CART
      </Text>
      {isData ? (
        <Box>
          {tracksCart.length > 0 && (
            <Box>
              <Box p="5px 5px 5px 10px" borderRadius="10px" bg="#252525">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="18px" fontWeight={700} color="#fff">
                    TRACKS:${totalPriceTrackAfterDiscount.toFixed(2)}
                  </Text>
                  <Text
                    cursor="pointer"
                    fontSize="12px"
                    fontWeight={700}
                    color="#fff"
                    p="5px 15px"
                    onClick={() => setViewTrack(!viewTrack)}
                  >
                    VIEW
                  </Text>
                </Flex>
                {viewTrack && (
                  <TracksCart
                    tracksCart={tracksCart}
                    setIsCart={setIsCart}
                    discountTrack={discountTrack}
                  />
                )}
              </Box>
              <Box p="10px 5px 20px" fontSize="16px" fontFamily="sans-serif">
                <Text>
                  You have <strong>{tracksCart.length}</strong> tracks in your
                  cart.
                </Text>
                {discountTracks?.isDiscount ? (
                  <Text>
                    You are saving <strong>{discountTrack}</strong>% on all
                    tracks.
                  </Text>
                ) : (
                  <Text>
                    You are saving <strong>{discountTrack}</strong>% on all
                    tracks. Add <strong>{discountInfoTrack?.moreTrack}</strong>{' '}
                    more tracks to save{' '}
                    <strong>{discountInfoTrack?.percentage}</strong>% on all
                    tracks.
                  </Text>
                )}
              </Box>
            </Box>
          )}
          {releasesCart.length > 0 && (
            <Box>
              <Box p="5px 5px 5px 10px" borderRadius="10px" bg="#252525">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="18px" fontWeight={700} color="#fff">
                    MULTIPACKS:${totalPriceReleaseAfterDiscount.toFixed(2)}
                  </Text>
                  <Text
                    cursor="pointer"
                    fontSize="12px"
                    fontWeight={700}
                    color="#fff"
                    p="5px 15px"
                    onClick={() => setViewRelease(!viewRelease)}
                  >
                    VIEW
                  </Text>
                </Flex>
                {viewRelease && (
                  <ReleasesCart
                    releasesCart={releasesCart}
                    setIsCart={setIsCart}
                    discountRelease={discountRelease}
                  />
                )}
              </Box>
              <Box p="10px 5px 20px" fontSize="16px" fontFamily="sans-serif">
                <Text>
                  You have <strong>{releasesCart.length}</strong> mutltipacks in
                  your cart.
                </Text>
                {!discountReleases?.isDiscount ? (
                  <Text>
                    You are saving <strong>{discountRelease}</strong>% on all
                    mutltipacks. Add{' '}
                    <strong>{discountInfoRelease?.moreRelease}</strong> more
                    mutltipacks to save{' '}
                    <strong>{discountInfoRelease?.percentage}</strong>% on all
                    mutltipacks.
                  </Text>
                ) : (
                  <Text>
                    You are saving <strong>{discountRelease}</strong>% on all
                    mutltipacks.
                  </Text>
                )}
              </Box>
            </Box>
          )}

          <Box
            borderBottom="3px solid #252525"
            borderTop="3px solid #252525"
            py="20px"
            fontSize="17px"
            fontWeight={600}
          >
            <Flex
              p="5px 5px 5px 10px"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>
                You are saving a total of $
                <strong>
                  {(totalSaveTrack + totalSaveRelease).toFixed(2)}
                </strong>{' '}
                on your entire order.
              </Text>
              <Text>TOTAL : ${totalPriceCheckout}</Text>
            </Flex>
          </Box>
          <Button
            mt="30px"
            mb="15px"
            background="#000"
            color="#fff"
            _hover={{ background: '#000', color: '#fff' }}
            onClick={() => {
              handleCreateOrderApi();
              sendSlack({
                text: '👀 Opened Checkout',
                block: '👀 Opened Checkout',
                channelId: SLACK_CHANNELS.PAYPAL,
                attachments: [
                  `totalPriceCheckout: ${totalPriceCheckout}`,
                  `User ID: ${userDetail?._id}`,
                ],
              });
            }}
            isLoading={isLoadingCreateOrder}
            isDisabled={isLoadingWishlist || isLoadingCreateOrder}
          >
            Checkout
          </Button>
        </Box>
      ) : (
        <Flex minH="200px" w="100%" alignItems="center" justifyContent="center">
          <Empty text="No Data" />
        </Flex>
      )}

      <Modal
        onClose={() => onCloseModalPaypalCheckout}
        isOpen={isShowModalPaypalCheckout}
      >
        <Box className={styles.modalPaypal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              You are checking out with ${totalPriceCheckout}
            </ModalHeader>
            <ModalBody>
              <PayPalButton
                currency="USD"
                onSuccess={payPalSuccess}
                onApprove={value => console.log(value, 'onApprove')}
                createOrder={(data, actions) => createOrder(data, actions)}
                onError={() => console.log('onError')}
                options={{
                  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
                }}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                bg="#EDF2F7"
                color="#1A202C"
                onClick={() => {
                  onCloseModalPaypalCheckout();
                  sendSlack({
                    text: '👀 Closed Checkout',
                    block: '👀 Closed Checkout',
                    channelId: SLACK_CHANNELS.PAYPAL,
                    attachments: [
                      `totalPriceCheckout: ${totalPriceCheckout}`,
                      `User ID: ${userDetail?._id}`,
                    ],
                  });
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </Box>
  );
}
