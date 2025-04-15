import { Button, Image, useColorModeValue } from '@chakra-ui/react';
import styles from './index.module.scss';

export const DropboxLoginBtn = () => {
  const loginBgBtn = useColorModeValue('white', 'gray.700');

  return (
    <Button className={styles.googleIcon} variant="solid" bg={loginBgBtn}>
      <Image
        cursor="pointer"
        src="https://cfl.dropboxstatic.com/static/metaserver/static/images/logo_catalog/dropbox_logo_glyph_m1.svg"
        h="23px"
        w="23px"
        alt="Dropbox"
      />
      &nbsp;
      <a
        href={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.REACT_APP_KEY_DROPBOX}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_DROPBOX}`}
      >
        Login with Dropbox
      </a>
    </Button>
  );
};
