import { getJwtLocalStorage } from 'app/helpers/local-storage';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  layout: any;
  component: any;
  exact: boolean;
  name: string;
  path: string;
}

export const PrivateRoute = memo(
  ({
    layout: YourLayout,
    component: YourComponent,
    ...rest
  }: PrivateRouteProps) => {
    const { isAuthenticated } = useSelector(selectAuth);
    const accessToken = getJwtLocalStorage();
    const { userDetail } = useSelector(selectAuth);

    const redirectURL = localStorage.getItem('subApp');
    const url = localStorage.getItem('services');

    useEffect(() => {
      if (userDetail) {
        if (url === '/services') {
          if (redirectURL) {
            window.location.assign(redirectURL);
          }
        } else {
          localStorage.removeItem('subApp');
          localStorage.removeItem('services');
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redirectURL]);

    return (
      <Route
        {...rest}
        render={routeProps => {
          return !!accessToken || isAuthenticated ? (
            <>{YourComponent && <YourComponent {...routeProps} />}</>
          ) : (
            <Redirect to="/auth/login" />
          );
        }}
      />
    );
  },
);
