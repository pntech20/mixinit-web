import { useDropboxAuthentication } from 'app/hooks/dropbox/useDropboxAuthentication';
import { useEffect } from 'react';

export function DropBox() {
  const { handleSuccess } = useDropboxAuthentication();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      handleSuccess(authCode);
    }
  }, [handleSuccess]);

  return <></>;
}
