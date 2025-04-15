import { useAuthSlice } from 'app/pages/Login/slice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useDropboxAuthentication = () => {
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();

  const handleSuccess = useCallback(
    token => {
      const isSocialLogin = true;
      localStorage.setItem('isSocialLogin', JSON.stringify(isSocialLogin));
      dispatch(actions.authenticateWithDropbox(token));
    },
    [actions, dispatch],
  );

  return {
    handleSuccess,
  };
};
