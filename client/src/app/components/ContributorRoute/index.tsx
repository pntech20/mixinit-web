import { selectAuth } from 'app/pages/Login/slice/selectors';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface ContributorRouteProps extends RouteProps {
  layout: any;
  component: any;
  exact: boolean;
  name: string;
  path: string;
}

export const ContributorRoute = memo(
  ({
    layout: YourLayout,
    component: YourComponent,
    ...rest
  }: ContributorRouteProps) => {
    const { userDetail } = useSelector(selectAuth);

    return (
      userDetail && (
        <Route
          {...rest}
          render={routeProps => {
            return userDetail?.isContributor ? (
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
