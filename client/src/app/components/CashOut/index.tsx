import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useDisclosure } from '@chakra-ui/hooks';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useCashOut } from 'app/hooks/useCashout';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { FunctionComponent, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'app/helpers/toast';
import DescriptionText from '../DescriptionText';
import { useTranslation } from 'react-i18next';
import { TOKEN_VALUE } from 'app/constants';
import { usePlayers } from 'app/hooks/player/usePlayers';

interface CashOutProps {}

const CashOut: FunctionComponent<CashOutProps> = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    isLoadingProceed,
    valueToken,
    setValueToken,
    requestedCashout,
    requestedCashoutSuccess,
    proceedCashoutSuccess,
    setValueOTP,
    valueOTP,
    proceedCashOut,
  } = useCashOut();

  const { handleInputFocus, handleInputBlur } = usePlayers();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userDetail } = useSelector(selectAuth);
  const { purchasedTokensRemaining } = userDetail;

  const handleRequestCashOut = useCallback(() => {
    if (valueToken <= 0) return toastError('Please input token valid');
    if (valueToken > purchasedTokensRemaining)
      return toastError('Not enough token');
    requestedCashout(valueToken);
  }, [requestedCashout, purchasedTokensRemaining, valueToken]);

  const handleProceedCashOut = useCallback(() => {
    proceedCashOut(valueOTP);
  }, [proceedCashOut, valueOTP]);

  useEffect(() => {
    if (requestedCashoutSuccess) {
      onOpen();
    }
  }, [onOpen, requestedCashoutSuccess]);

  useEffect(() => {
    if (proceedCashoutSuccess) {
      onClose();
      toastSuccess('CashOut success.');
      setValueToken(0);
    }
  }, [onClose, proceedCashoutSuccess, setValueToken]);

  return (
    <Box mt="30px">
      <DescriptionText text={t('cashOut.description')} />
      <Flex
        flexWrap="wrap"
        justifyContent="space-between"
        mt="20px"
        gridGap="10px"
      >
        <Flex>
          <Text>{t('cashOut.tokenBalance')} &nbsp;</Text>
          <Text as="span" color="red">
            {purchasedTokensRemaining}
          </Text>
        </Flex>
        <Flex>
          <Text>{t('cashOut.tokenRemaining')} &nbsp;</Text>
          <Text as="span" color="red">
            {purchasedTokensRemaining - valueToken}
          </Text>
        </Flex>
        <Flex>
          <Text>{t('cashOut.tokenValue')} &nbsp;</Text>
          <Text as="span" color="red">
            ${TOKEN_VALUE}
          </Text>
        </Flex>
        <Input
          w="100%"
          type="number"
          value={valueToken}
          onChange={e => setValueToken(e.target.value)}
          placeholder={t('cashOut.inputTokenPlaceholder')}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <Text>
          {t('cashOut.tokens')} &nbsp;
          <Text as="span" color="red">
            {valueToken || 0}
          </Text>
        </Text>
        <Flex>
          <Text>{t('cashOut.values')} &nbsp;</Text>
          <Text as="span" color="red">
            ${(Number(TOKEN_VALUE) * valueToken).toFixed(2)}
          </Text>
        </Flex>
      </Flex>

      <Button mt="20px" onClick={handleRequestCashOut} disabled={isLoading}>
        {t('cashOut.request')} {isLoading && <Spinner marginLeft="8px" />}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw money to Paypal</ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Enter OTP:</FormLabel>
              <Input
                placeholder="Please OTP"
                _placeholder={{ color: '#d4d4d4' }}
                onChange={e => setValueOTP(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} disabled={isLoadingProceed}>
              Cancel
            </Button>
            <Button
              colorScheme="#ed7358"
              bgColor="#ed7358"
              ml={3}
              color="white"
              onClick={handleProceedCashOut}
              disabled={isLoadingProceed}
            >
              Process {isLoadingProceed && <Spinner marginLeft="8px" />}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CashOut;
