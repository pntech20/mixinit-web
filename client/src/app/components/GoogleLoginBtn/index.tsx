import { Button, Text, useColorModeValue } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from 'app/assets/svgs/GoogleIcon';
import { useGoogleAuthentication } from 'app/hooks/google/useGoogleAuthentication';
import styles from './index.module.scss';

export const GoogleLoginBtn = () => {
  const { handleSuccess } = useGoogleAuthentication();
  const loginBgBtn = useColorModeValue('white', 'gray.700');

  const handleResponseGoogleFail = e => {
    console.log('Google ERR: ', e);
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleResponseGoogleFail,
  });
  return (
    <Button
      onClick={() => login()}
      className={styles.googleIcon}
      variant="solid"
      bg={loginBgBtn}
    >
      <GoogleIcon />
      &nbsp;
      <Text>Login with Google</Text>
    </Button>
  );
};
