import { useAuthSlice } from 'app/pages/Login/slice';
import { GoogleAuthenticatePayload } from 'app/pages/Login/slice/types';
import {
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from 'react-facebook-login';
import { useDispatch } from 'react-redux';

export const useFacebookAuthentication = () => {
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();

  const handleSuccess = (
    response: ReactFacebookLoginInfo | ReactFacebookFailureResponse,
  ) => {
    const isSocialLogin = true;
    localStorage.setItem('isSocialLogin', JSON.stringify(isSocialLogin));
    if ('accessToken' in response) {
      const accessToken = response.accessToken;
      const payload: GoogleAuthenticatePayload = {
        token: accessToken,
      };
      dispatch(actions.authenticateWithFacebook(payload));
    }
  };

  return {
    handleSuccess,
  };
};
