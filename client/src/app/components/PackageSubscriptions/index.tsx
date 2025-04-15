import {
  Box,
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  useDisclosure,
  ModalBody,
} from '@chakra-ui/react';
import { generateArray } from 'app/helpers/functions';
import { useTokenPackages } from 'app/hooks/services/useTokenPackages';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Empty from '../Empty';
import SkeletonItem from '../SkeletonItem';
import SubscriptionItem from '../SubscriptionItem';
import './styles.scss';
import useContributorSubscriptionPool from 'app/hooks/services/useContributorSubscriptionPool';
import { formatMoney } from 'app/utils/currency';
import { sendSlack } from 'app/apis/track';
import { SLACK_CHANNELS } from 'app/constants/enum';
import { useSelector } from 'react-redux';
import { selectAuth } from 'app/pages/Login/slice/selectors';

const PackageSubscriptions = (dataSubAppId: any) => {
  const {
    tokenPackages: packages,
    onGetTokenPackages,
    toggleModalBuyTokens,
    handleClickBuyTokens,
    isVisible,
    selectedTokenPackage,
    isLoading,
    handleClickUnScribe,
    isUnSubscribeSuccess,
    setSelectedTokenPackage,
    setLoadingUnSub,
    isLoadingUnSub,
    setIsVisible,
    handleCreateSubscription,
    isLoadingCreateSubscription,
  } = useTokenPackages();
  const { userDetail } = useSelector(selectAuth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isUnSubscription, setIsUnSubscription] = useState<boolean>(false);

  const subscriptionPackages = packages?.filter(pac => pac?.isRecurring);

  useEffect(() => {
    onGetTokenPackages();
  }, [onGetTokenPackages]);

  useEffect(() => {
    if (isUnSubscribeSuccess) {
      onClose();
      setLoadingUnSub(false);
    }
  }, [isUnSubscribeSuccess, onClose, setLoadingUnSub]);

  const handleChangeSort = useCallback((data, field) => {
    return [...data].sort((a, b) => {
      var itemA = a?.[field];
      var itemB = b?.[field];
      return itemA < itemB ? -1 : itemA > itemB ? 1 : 0;
    });
  }, []);

  const renderLoading = () => (
    <Box mt="15px">
      <SimpleGrid gridGap="10px" columns={{ base: 1, sm: 2, md: 3, xl: 4 }}>
        {generateArray(4).map(item => (
          <SkeletonItem key={item} borderRadius="10px" />
        ))}
      </SimpleGrid>
    </Box>
  );

  const newSubscriptionPackages = handleChangeSort(
    subscriptionPackages,
    'recurringDays',
  );

  const alreadySubscribed = useMemo(() => {
    const find = newSubscriptionPackages.find(sub => sub?.isSubscribe);
    return !!find;
  }, [newSubscriptionPackages]);

  const { allowToSubscribeSubscription } = useContributorSubscriptionPool();

  useEffect(() => {
    allowToSubscribeSubscription();
  }, [allowToSubscribeSubscription]);

  const dataSubscriptionId = dataSubAppId?.dataSubAppId;

  return (
    <Box>
      <Box mt="30px">
        {isLoading ? (
          renderLoading()
        ) : !newSubscriptionPackages?.length ? (
          <Box margin="0 auto" textAlign="center">
            <Empty />
          </Box>
        ) : (
          <SimpleGrid
            gridGap={{ base: '40px', md: '15px' }}
            columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
          >
            {newSubscriptionPackages.map(item => (
              <Box key={item._id}>
                <SubscriptionItem
                  dataSubscriptionId={dataSubscriptionId}
                  subscription={item}
                  handleClickSubscribe={handleClickBuyTokens}
                  handleClickUnSubScribe={pac => {
                    onOpen();
                    setSelectedTokenPackage(pac);
                  }}
                  alreadySubscribed={alreadySubscribed}
                  setIsVisible={setIsVisible}
                  isUnSubscription={isUnSubscription}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
      <Modal
        onClose={() => {
          toggleModalBuyTokens();
          sendSlack({
            text: '👀 Closed Modal Subscribe',
            block: '👀 Closed Modal Subscribe',
            channelId: SLACK_CHANNELS.PAYPAL,
            attachments: [
              `Package price: ${selectedTokenPackage?.price}`,
              `User ID: ${userDetail?._id}`,
            ],
          });
        }}
        isOpen={isVisible}
      >
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              You are purchasing {selectedTokenPackage?.name}
              &nbsp; subscription for &nbsp;
              {formatMoney(selectedTokenPackage?.price || 0)}
            </ModalHeader>
            {/* <ModalBody>
              <PayPalButton
                currency="USD"
                onApprove={onBuyTokensSuccess}
                amount={selectedTokenPackage?.price}
                createSubscription={(data, details) =>
                  paypalSubscribe(data, details)
                }
                options={{
                  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
                  vault: true,
                }}
              />
            </ModalBody> */}

            <ModalFooter>
              <Flex gridGap="5px">
                <Button
                  bg="#EDF2F7"
                  color="#1A202C"
                  onClick={() => {
                    toggleModalBuyTokens();
                    sendSlack({
                      text: '👀 Closed Modal Subscribe',
                      block: '👀 Closed Modal Subscribe',
                      channelId: SLACK_CHANNELS.PAYPAL,
                      attachments: [
                        `Package price: ${selectedTokenPackage?.price}`,
                        `User ID: ${userDetail?._id}`,
                      ],
                    });
                  }}
                >
                  Close
                </Button>
                <Button
                  bg="#EDF2F7"
                  color="#1A202C"
                  isLoading={isLoadingCreateSubscription}
                  isDisabled={isLoadingCreateSubscription}
                  onClick={() => handleCreateSubscription()}
                >
                  Yes
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
      <Modal onClose={onClose} isOpen={isOpen}>
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure cancel this subscription?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              If you cancel your subscription now, you'll need to wait 30 days
              before you can subscribe again.
            </ModalBody>

            <ModalFooter>
              <Button
                disabled={isLoadingUnSub}
                onClick={() => {
                  setLoadingUnSub(true);
                  handleClickUnScribe(selectedTokenPackage);
                  setIsUnSubscription(true);
                }}
              >
                {isLoadingUnSub ? <Spinner /> : 'Yes'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </Box>
  );
};

export default PackageSubscriptions;
