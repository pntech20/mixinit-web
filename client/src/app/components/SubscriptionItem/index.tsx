import { Box, Button, chakra, Image, Text } from '@chakra-ui/react';
import SubImage from 'app/assets/images/subscription/sub-item-image.png';
import './styles.scss';
import axiosService from 'app/services/axios.service';
import { formatMoney } from 'app/utils/currency';
import { useCallback, useEffect } from 'react';
import { checkUserCanSubscribe } from 'app/apis/subscription ';
import { toastError } from 'app/helpers/toast';
import { formatDate } from 'app/utils/date';
import { useSelector } from 'react-redux';
import { selectAuth } from 'app/pages/Login/slice/selectors';

const SubscriptionItem = ({
  dataSubscriptionId,
  subscription,
  handleClickSubscribe,
  handleClickUnSubScribe,
  setIsVisible,
  isUnSubscription,
  alreadySubscribed,
}) => {
  const {
    labelsIncluded = [],
    recurringDays,
    price,
    isSubscribe = false,
    name,
    maxDownloadsPerMonth,
  } = subscription;

  const BASE_SUBAPPID_URL = '/v1/subscription-applications';
  const { isDisputing } = useSelector(selectAuth);

  const handleClickSubscription = async () => {
    const res: any = await checkUserCanSubscribe();
    if (!res?.canSubscribe)
      return toastError(
        `Sorry, You have cancelled a subscription within the past 30 days (${formatDate(
          res?.dateCancel,
        )}) so you can't subscribe a new one now. Please contact us if you need help.`,
      );
    // if (isLimitAccess) {
    //   history.push({
    //     pathname: `subscription-form`,
    //     state: subscription._id,
    //   });
    // } else {
    handleClickSubscribe(subscription);
    // }
  };

  const currentTime = new Date();
  const timestamp = currentTime.getTime();

  const handleApprovedAt = useCallback(async () => {
    const data = {
      ...dataSubscriptionId,
      approvedAt: String(timestamp),
    };
    await axiosService.put(
      `${BASE_SUBAPPID_URL}/${dataSubscriptionId?._id}`,
      data,
    );
  }, [dataSubscriptionId, timestamp]);

  useEffect(() => {
    if (
      dataSubscriptionId?.status === 'approved' &&
      dataSubscriptionId?.approvedAt === null &&
      dataSubscriptionId?.subscriptionId?._id === subscription._id &&
      !isUnSubscription
    ) {
      handleClickSubscribe(subscription);
    }
  }, [
    dataSubscriptionId,
    handleClickSubscribe,
    isUnSubscription,
    subscription,
    subscription._id,
  ]);

  useEffect(() => {
    if (
      dataSubscriptionId?.status === 'approved' &&
      dataSubscriptionId?.approvedAt === null &&
      dataSubscriptionId?.subscriptionId?._id === subscription._id
    ) {
      handleApprovedAt();
    }
  }, [dataSubscriptionId, handleApprovedAt, subscription._id]);

  useEffect(() => {
    if (
      dataSubscriptionId?.status === 'approved' &&
      dataSubscriptionId?.approvedAt === null &&
      dataSubscriptionId?.subscriptionId?._id === subscription._id &&
      isSubscribe
    ) {
      setIsVisible(false);
    }
  }, [
    dataSubscriptionId,
    handleApprovedAt,
    isSubscribe,
    setIsVisible,
    subscription._id,
  ]);

  return (
    <Box
      className="subItem"
      _hover={{ bg: '#f8f8f8' }}
      _dark={{ _hover: { bg: 'unset' } }}
    >
      <Image src={SubImage} alt="SubImage" />
      <Box mb="25px">
        <Box className="sub-header">{name}</Box>
      </Box>
      <Box mb="12px">
        <Box className="sub-price">
          <Text className="main-price">{formatMoney(price)}</Text>
          <Box fontWeight="bold" className="divider-subs"></Box>
          <Text fontWeight="bold" className="recurringDays">
            {recurringDays} days
          </Text>
        </Box>
      </Box>
      <Text className="des-subs">
        up to {''} <chakra.span>{maxDownloadsPerMonth}</chakra.span> downloads
        per <chakra.span>{recurringDays} days</chakra.span>
      </Text>
      <Button
        className="btn-subscribe"
        width="100%"
        disabled={
          isDisputing || (alreadySubscribed && !subscription?.isSubscribe)
        }
        onClick={() => {
          isSubscribe
            ? handleClickUnSubScribe(subscription)
            : handleClickSubscription();
        }}
      >
        {isSubscribe ? 'Unsubscribe' : 'Subscribe'}
      </Button>
      <Text className="des-download">download from these labels:</Text>
      <ul className="listLabels">
        {labelsIncluded?.map(label => (
          <li className="labelItem" key={label?._id}>
            <Box className="labelItemText">{label?.name}</Box>
            {label?.numberDownloadedTrackSubscription > 0 && isSubscribe && (
              <Text ml="30px" textAlign="left" fontSize="14px">
                (Downloaded: {label?.numberDownloadedTrackSubscription})
              </Text>
            )}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default SubscriptionItem;
