import { Box, Button } from '@chakra-ui/react';
import { InputItem } from 'app/components/InputItem';
import { useChangePassword } from 'app/hooks/changePassword/useChangePassword';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@chakra-ui/color-mode';
import styles from './styles.module.scss';
import classNames from 'classnames';

interface ChangePasswordProps {
  onClose?: () => void;
}

const ChangePassword = ({ onClose }: ChangePasswordProps) => {
  const { t } = useTranslation();
  const { handleSubmit, onSubmit, control, errors } = useChangePassword({
    onClose,
  });
  const { colorMode } = useColorMode();

  return (
    <Box
      className={classNames(
        styles.changePassword,
        styles[`changePassword${colorMode}`],
      )}
      minHeight="400px"
      p="35px 15px"
      borderRadius="10px"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={classNames(styles.changePasswordTitle)}>
          {t('accountSettings.changePassword.tittle')}
        </Box>
        <Box>
          <InputItem
            placeholder={t('accountSettings.changePassword.enterPassWord')}
            control={control}
            type="password"
            label={t('accountSettings.changePassword.enterPassWord')}
            name="currentPassword"
            errors={errors.currentPassword}
          />
          <InputItem
            placeholder={t('accountSettings.changePassword.enterNewPassword')}
            control={control}
            type="password"
            label={t('accountSettings.changePassword.newPassword')}
            name="newPassword"
            errors={errors.newPassword}
          />
          <InputItem
            placeholder={t(
              'accountSettings.changePassword.enterRepeatPassword',
            )}
            control={control}
            type="password"
            label={t('accountSettings.changePassword.repeatPassword')}
            name="passwordConfirmation"
            errors={errors.passwordConfirmation}
          />
        </Box>
        <Box>
          <Button
            w="100%"
            bg="#5c94e8"
            color="white"
            type="submit"
            mt="25px"
            _hover={{ backgroundColor: 'none' }}
          >
            {t('accountSettings.changePassword.savePassword')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ChangePassword;
