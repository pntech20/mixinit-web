import { ContributorRoute } from 'app/components/ContributorRoute';
import { PrivateRoute } from 'app/components/PrivateRoute';
import { PublicRoute } from 'app/components/PublicRoute';
import { getJwtLocalStorage } from 'app/helpers/local-storage';
import { useSocket } from 'app/hooks/socket/useSocket';
import LoggedComponent from 'app/layouts/LoggedComponent';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AUTH_ROUTES, CONTRIBUTOR_ROUTES, GENERAL_ROUTES } from './index';

export const RenderRoutes = () => {
  useSocket();

  const { isAuthenticated } = useSelector(selectAuth);
  const accessToken = getJwtLocalStorage();

  const loggedRoutes = useMemo(() => {
    return [...GENERAL_ROUTES];
  }, []);

  const renderContributorRoutes = useCallback(() => {
    return CONTRIBUTOR_ROUTES.map(route => {
      return <ContributorRoute key={route.path} {...route} />;
    });
  }, []);

  const renderLoggedRoutes = useCallback(() => {
    return loggedRoutes.map(route => {
      return <PrivateRoute key={route.path} {...route} />;
    });
  }, [loggedRoutes]);

  const renderAuthRoutes = useCallback(() => {
    return AUTH_ROUTES.map(route => {
      return <PublicRoute key={route.path} {...route} />;
    });
  }, []);

  return (
    <Switch>
      {renderAuthRoutes()}

      {(!!accessToken || isAuthenticated) && (
        <LoggedComponent>
          {renderContributorRoutes()}
          {renderLoggedRoutes()}
          {/* {renderAdminContributorRoutes()} */}
        </LoggedComponent>
      )}

      {/* <Route component={NotFoundPage} /> */}
    </Switch>
  );
};
