import {
  Box,
  Button,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import logoIconLight from 'app/assets/logo/crooklyn-clan-logo-refresh-black.svg';
import { HelmetPage } from 'app/components/HelmetPage';
import { InputItem } from 'app/components/InputItem';
import { toastSuccess } from 'app/helpers/toast';
import { useResetPasswordForm } from 'app/hooks/forgotPassword/useResetPasswordForm';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import styles from './resetPassword.module.scss';

export const ResetPassword = memo(() => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    onSubmit,
    isLoading,
    resetPasswordSuccess,
    errors,
  } = useResetPasswordForm();

  const history = useHistory();
  const params = useLocation();
  const token = params.search.replace('?token=', '');

  useEffect(() => {
    if (resetPasswordSuccess) {
      toastSuccess(t('resetPassword.resetPwSuccess'));
      history.push('/auth/login');
    }
  });

  const handleOnSubmit = (values, token) => {
    onSubmit({
      ...values,
      token,
    });
  };

  return (
    <>
      <HelmetPage title={`${t('commonItem.resetPassword')}`} />
      <Flex
        className={styles.container}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} maxWidth={420}>
          <Box
            rounded="lg"
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="lg"
            p={6}
          >
            <Flex className={styles.headerWidget}>
              <a
                href="https://www.crooklynclan.net/"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  display="inline"
                  width={120}
                  src={logoIconLight}
                  alt="logo"
                  fallbacksrc={logoIconLight}
                />
              </a>
            </Flex>
            <Text className={styles.headerText}>
              {t('resetPassword.title')}
            </Text>
            {!resetPasswordSuccess && (
              <>
                <form
                  onSubmitCapture={handleSubmit(values =>
                    handleOnSubmit(values, token),
                  )}
                >
                  <InputItem
                    placeholder={t('resetPassword.instruction')}
                    type="password"
                    name="password"
                    label={t('resetPassword.password')}
                    control={control}
                    errors={errors.password}
                  />
                  <Box mt="20px"></Box>
                  <InputItem
                    placeholder={t('resetPassword.passwordConfirmation')}
                    type="password"
                    name="passwordConfirmation"
                    label={t('resetPassword.passwordConfirmation')}
                    control={control}
                    errors={errors?.passwordConfirmation}
                  />
                  <Box textAlign="center">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className={styles.btnForgotPassword}
                    >
                      {t('forgotPassword.resetPassword')}
                    </Button>
                  </Box>
                </form>
              </>
            )}
          </Box>
        </Stack>
      </Flex>
    </>
  );
});
