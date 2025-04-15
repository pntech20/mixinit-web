import { getJwtLocalStorage } from 'app/helpers/local-storage';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface PublicRouteProps extends RouteProps {
  layout: any;
  component: any;
  restricted: boolean;
  exact: boolean;
  name: string;
  path: string;
}

export const PublicRoute = memo(
  ({
    restricted,
    layout: YourLayout,
    component: YourComponent,
    ...rest
  }: PublicRouteProps) => {
    const { isAuthenticated } = useSelector(selectAuth);
    const accessToken = getJwtLocalStorage();

    return (
      <Route
        {...rest}
        render={routeProps =>
          (!!accessToken || isAuthenticated) && restricted ? (
            <Redirect to="/home" />
          ) : (
            <>{YourComponent && <YourComponent {...routeProps} />}</>
          )
        }
      />
    );
  },
);
