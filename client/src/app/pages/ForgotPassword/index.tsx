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
import { useForgotPasswordForm } from 'app/hooks/forgotPassword/useForgotPasswordForm';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

export const ForgotPassword = memo(() => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    onSubmit,
    isLoading,
    sentEmailSuccess = false,
    errors,
  } = useForgotPasswordForm();

  return (
    <>
      <HelmetPage title={`${t('commonItem.forgotPassword')}`} />
      <Flex
        bg={useColorModeValue('gray.50', 'gray.800')}
        className={styles.container}
      >
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} maxWidth={420}>
          <Box
            rounded="lg"
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="lg"
            p={6}
          >
            <Flex justifyContent="center">
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
            {sentEmailSuccess && (
              <Box className={styles.signIn} mt="50px">
                <Box as="p">{t('forgotPassword.thankyou')}</Box>
                <Box as="p">{t('forgotPassword.checkYourInbox')}</Box>
              </Box>
            )}

            {!sentEmailSuccess && (
              <>
                <Text className={styles.headerText}>
                  {t('forgotPassword.passwordReset')}
                </Text>
                <Text className={styles.signIn}>
                  {t('forgotPassword.content')}
                </Text>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <InputItem
                    placeholder={t('forgotPassword.enterEmail')}
                    className="email"
                    control={control}
                    type="email"
                    name="email"
                    errors={errors.email}
                  />

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className={styles.btnForgotPassword}
                  >
                    {t('forgotPassword.resetPassword')}
                  </Button>

                  <Box className={styles.bottomLinkWidget}>
                    <Link to="/auth/signup">{t('forgotPassword.signup')}</Link>
                    <Link to="/auth/login">{t('forgotPassword.login')}</Link>
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
