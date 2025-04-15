import { useAuthSlice } from 'app/pages/Login/slice';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import axiosService from 'app/services/axios.service';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

const BASE_USER_URL = '/v1/users';

const CheckNeedConfirmContributorMiddleware = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();
  const { userDetail } = useSelector(selectAuth);

  const pathnames = useMemo(
    () => [
      '/auth/signup',
      '/auth/login',
      '/auth/reset-password',
      '/auth/forgot-password',
    ],
    [],
  );

  const callApiCheckNeedConfirmContributor = useCallback(async () => {
    try {
      const response = await axiosService.get(
        `${BASE_USER_URL}/check-need-confirm-contributor`,
      );
      const isNeedToConfirmContributor =
        response.data.data.needToConfirmContributor;

      if (isNeedToConfirmContributor === true) {
        dispatch(actions.updateConfirmContributor(isNeedToConfirmContributor));
        history.push('/contributor-onboarding');
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  }, [actions, dispatch, history]);

  const getStatusDisputingUser = useCallback(async () => {
    try {
      const response = await axiosService.get(
        `${BASE_USER_URL}/get-status-dispute`,
      );
      const isDisputing = response.data.data.isDisputing;
      dispatch(actions.updateStatusDisputingUser(isDisputing));
    } catch (error) {
      console.error('Error calling API:', error);
    }
  }, [actions, dispatch]);

  useEffect(() => {
    if (!pathnames.includes(pathname) && userDetail) {
      callApiCheckNeedConfirmContributor();
      getStatusDisputingUser();
    }
  }, [
    pathnames,
    callApiCheckNeedConfirmContributor,
    pathname,
    userDetail,
    getStatusDisputingUser,
  ]);

  return null;
};

export default CheckNeedConfirmContributorMiddleware;
