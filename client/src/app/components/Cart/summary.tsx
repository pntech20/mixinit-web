import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import { PayPalButton } from 'react-paypal-button-v2';
import Empty from '../Empty';
import styles from './cart.module.scss';
import Total from './total';
import { getLocalStorage } from 'app/helpers/local-storage';
import { COUNTRY, IP_ADDRESS } from 'app/constants';
import { formatMoney } from 'app/utils/currency';
import { sendSlack } from 'app/apis/track';
import { SLACK_CHANNELS } from 'app/constants/enum';

interface Props {
  tracksCart?: any;
  releasesCart?: any;
  discountTrack?: number;
  discountRelease?: number;
  setIsCart?: (e: boolean) => void;
}

export function Summary({
  tracksCart,
  releasesCart,
  discountTrack = 0,
  discountRelease = 0,
  setIsCart,
}: Props) {
  const { isLightMode } = useModeTheme();

  const {
    isShowModalPaypalCheckout,
    onOpenModalPaypalCheckout,
    onCloseModalPaypalCheckout,
    onCheckoutSuccess,
  } = useWishlists();

  let totalPriceTracks = 0;
  for (let i = 0; i < tracksCart.length; i++) {
    totalPriceTracks += tracksCart[i].track.price;
  }
  let totalPriceReleases = 0;
  for (let i = 0; i < releasesCart.length; i++) {
    totalPriceReleases += releasesCart[i].release.price;
  }
  const isData = tracksCart.length > 0 || releasesCart.length > 0;

  const totalPriceAfterFeeTracks = totalPriceTracks;
  const totalPriceAfterDiscountTracks =
    totalPriceAfterFeeTracks * (1 - +discountTrack / 100);
  const totalSaveTracks = totalPriceTracks - totalPriceAfterDiscountTracks;

  const totalPriceAfterFeeReleases = totalPriceReleases;
  const totalPriceAfterDiscountReleases =
    totalPriceAfterFeeReleases * (1 - +discountRelease / 100);
  const totalSaveReleases =
    totalPriceReleases - totalPriceAfterDiscountReleases;

  const totalSave = (totalSaveTracks + totalSaveReleases).toFixed(2);
  const totalPriceCheckout = (
    totalPriceAfterDiscountTracks + totalPriceAfterDiscountReleases
  ).toFixed(2);

  const payPalSuccess = (details: any) => {
    const paypalTransactionId =
      details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || '';
    const data = {
      type: 'all',
      paypalTransactionId,
      status: details?.status,
      paypalEmail: details?.payer?.email_address,
      trackDiscount: discountTrack,
      releaseDiscount: discountRelease,
      trackCost: totalPriceAfterDiscountTracks,
      releaseCost: totalPriceAfterDiscountReleases,
      totalCost: totalPriceCheckout,
      ipAddress: getLocalStorage(IP_ADDRESS),
      country: getLocalStorage(COUNTRY),
      discountRelease,
      discountTrack,
    };
    onCheckoutSuccess(data);
    setIsCart && setIsCart(false);
  };

  return (
    <>
      <Box py="10px" bg={isLightMode ? '#f8f8f8' : '#1A202C'}>
        {isData ? (
          <Box px="10px">
            <Total
              tracksCart={tracksCart}
              discountTrack={discountTrack}
              title="TOTAL TRACKS"
              text="RETAIL"
            />
            <Total
              releasesCart={releasesCart}
              discountRelease={discountRelease}
              title="TOTAL MULTIPACKS"
              text="RETAIL"
              isReleases
            />
            <Box className={styles.total} px="10px">
              <Box color="red">
                RETAIL TOTAL: $
                {(
                  +totalPriceTracks.toFixed(2) + +totalPriceReleases.toFixed(2)
                ).toFixed(2)}
              </Box>
              <Box color="#008820">
                TOTAL SAVINGS: {formatMoney(+totalSave)}
              </Box>
              <Box
                className={styles.totalPay}
                color={isLightMode ? '#333' : '#fff'}
                whiteSpace="nowrap"
              >
                YOU PAY: {formatMoney(+totalPriceCheckout)}
              </Box>
              <Button
                mt="10px"
                background="#000"
                color="#fff"
                _hover={{ background: '#000', color: '#fff' }}
                onClick={() => {
                  onOpenModalPaypalCheckout();
                  sendSlack({
                    text: '👀 User clicks Checkout TEST',
                    block: '👀 User clicks Checkout TEST',
                    channelId: SLACK_CHANNELS.PAYPAL,
                    attachments: [`totalPriceCheckout: ${totalPriceCheckout}`],
                  });
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        ) : (
          <Flex
            minH="200px"
            w="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Empty text="No Data" />
          </Flex>
        )}
      </Box>
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
              <p>TEST</p>
              {/* <PayPalButton
                currency="USD"
                amount={totalPriceCheckout}
                onSuccess={payPalSuccess}
                options={{
                  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
                }}
              /> */}
            </ModalBody>

            <ModalFooter>
              <Button
                bg="#EDF2F7"
                color="#1A202C"
                onClick={onCloseModalPaypalCheckout}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </>
  );
}
