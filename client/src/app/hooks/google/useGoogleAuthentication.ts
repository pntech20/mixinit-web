import { useAuthSlice } from 'app/pages/Login/slice';
import { GoogleAuthenticatePayload } from 'app/pages/Login/slice/types';

import { useDispatch } from 'react-redux';

export const useGoogleAuthentication = () => {
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();

  const handleSuccess = response => {
    const isSocialLogin = true;
    localStorage.setItem('isSocialLogin', JSON.stringify(isSocialLogin));
    if ('access_token' in response) {
      const accessToken = response.access_token;
      const payload: GoogleAuthenticatePayload = {
        token: accessToken,
      };
      dispatch(actions.authenticateWithGoogle(payload));
    }
  };

  return {
    handleSuccess,
  };
};
