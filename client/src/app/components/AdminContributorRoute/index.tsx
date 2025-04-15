import { Role } from 'app/constants/enum';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface AdminContributorRouteProps extends RouteProps {
  layout: any;
  component: any;
  exact: boolean;
  name: string;
  path: string;
}

export const AdminContributorRoute = memo(
  ({
    layout: YourLayout,
    component: YourComponent,
    ...rest
  }: AdminContributorRouteProps) => {
    const { userDetail } = useSelector(selectAuth);

    return (
      userDetail && (
        <Route
          {...rest}
          render={routeProps => {
            return userDetail?.isContributor &&
              userDetail?.role === Role.ADMIN ? (
              <>{YourComponent && <YourComponent {...routeProps} />}</>
            ) : (
              <Redirect to="/home" />
            );
          }}
        />
      )
    );
  },
);
