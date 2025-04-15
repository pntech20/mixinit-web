import { Button, Text } from '@chakra-ui/react';
import FacebookIcon from 'app/assets/svgs/FacebookIcon';
import { useFacebookAuthentication } from 'app/hooks/facebook/useFacebookAuthentication';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import styles from './index.module.scss';

export const FacebookLoginBtn = () => {
  const appId = process.env.REACT_APP_FACEBOOK_APP_ID || '';
  const { handleSuccess } = useFacebookAuthentication();

  return (
    <FacebookLogin
      appId={appId}
      // appId={'252402340531581'}
      fields="name,email"
      callback={handleSuccess}
      render={renderProps => (
        <Button
          onClick={renderProps.onClick}
          className={styles.facebookIcon}
          variant="solid"
        >
          <FacebookIcon />
          &nbsp;
          <Text>Login with Facebook</Text>
        </Button>
      )}
    />
  );
};
