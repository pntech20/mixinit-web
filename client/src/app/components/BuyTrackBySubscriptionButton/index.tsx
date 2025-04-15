import {
  AlertDialogBody,
  Box,
  Button,
  Checkbox,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { getLocalStorage, setLocalStorage } from 'app/helpers/local-storage';
import { toastWarning } from 'app/helpers/toast';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useSubscriptions } from 'app/hooks/subscription/useSubscriptions';
import { isEmpty } from 'ramda';
import { useCallback, useEffect } from 'react';
import { MdSubscriptions } from 'react-icons/md';

interface BuyTrackBySubscriptionButtonProps {
  trackId: string;
  onclickSubscription?: (trackId: string) => void;
  handleOpenBuyTrackBySub?: any;
}

export default function BuyTrackBySubscriptionButton({
  trackId,
  onclickSubscription,
  handleOpenBuyTrackBySub,
}: BuyTrackBySubscriptionButtonProps) {
  const { isUseInput } = usePlayers();

  const { buyTrackBySubscription, isOpen, onClose, onOpen } =
    useSubscriptions();

  const isShowMessDownloadSubStorage = getLocalStorage('isShowDownloadSub');
  const isShowMessDownloadSub = isEmpty(isShowMessDownloadSubStorage)
    ? true
    : isShowMessDownloadSubStorage;

  const onChange = useCallback(e => {
    if (e.target.checked)
      toastWarning('You can reset all warnings in your account settings.');
    setLocalStorage('isShowDownloadSub', !e.target.checked);
  }, []);

  const handleOnclickYes = useCallback(
    trackId => {
      buyTrackBySubscription(trackId);
      onclickSubscription && onclickSubscription(trackId);
      onClose();
    },
    [buyTrackBySubscription, onclickSubscription, onClose],
  );

  const handleKeyPress = useCallback(
    event => {
      const { key } = event;
      if (!isUseInput) {
        if (['Backspace'].includes(key)) {
          isOpen && onClose();
        }
        if (['Enter'].includes(key) && isOpen) {
          handleOnclickYes(trackId);
        }
      }
    },
    [handleOnclickYes, isOpen, isUseInput, onClose, trackId],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
  return (
    <>
      <Tooltip
        shouldWrapChildren
        hasArrow
        bg="gray.300"
        color="black"
        label="Buy with subscription"
      >
        <Box cursor="pointer">
          <MdSubscriptions
            size={20}
            onClick={() =>
              handleOpenBuyTrackBySub
                ? handleOpenBuyTrackBySub(trackId)
                : !isShowMessDownloadSub
                ? handleOnclickYes(trackId)
                : onOpen()
            }
          />
        </Box>
      </Tooltip>

      <Modal onClose={onClose} isOpen={isOpen}>
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>You are buying track by subscription?</ModalHeader>
            <AlertDialogBody>
              <Checkbox mt="10px" onChange={onChange}>
                <Text fontSize="14px">Don't Show Again</Text>
              </Checkbox>
            </AlertDialogBody>
            <ModalFooter>
              <Button bg="#EDF2F7" color="#1A202C" onClick={onClose}>
                Close
              </Button>
              <Button
                bg="#EDF2F7"
                color="#1A202C"
                ml="10px"
                onClick={() => handleOnclickYes(trackId)}
              >
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </>
  );
}
