import { CommunityPage } from 'app/components/CommunityPage/Loadable';
import { ReleaseEditor } from 'app/components/ReleaseEditor/Loadable';
import AuthLayout from 'app/layouts/Auth';
import GeneralLayout from 'app/layouts/General';
import { Accounting } from 'app/pages/Accounting/Loadable';
import { AccountSettingsPage } from 'app/pages/AccountSettingsPage';
import { CashOutPage } from 'app/pages/CashOut/Loadable';
import { ForgotPassword } from 'app/pages/ForgotPassword/Loadable';
import { LabelDetailPage } from 'app/pages/LabelDetailPage';
import { LabelsPage } from 'app/pages/LabelsPage';
import { Login } from 'app/pages/Login/Loadable';
import { Profile } from 'app/pages/Profile/Loadable';
import { ReleaseDetailPage } from 'app/pages/ReleaseDetail/Loadable';
import { ReleasesPage } from 'app/pages/Releases';
import { ResetPassword } from 'app/pages/ResetPassword/Loadable';
import { Services } from 'app/pages/Services';
import { Signup } from 'app/pages/Signup/Loadable';
import { TracksPage } from 'app/pages/Tracks/Loadable';
import { TrackDetailPage } from 'app/pages/TracksDetail/Loadable';
import { UploaderPage } from 'app/pages/Uploader/Loadable';
import { Redirect } from 'react-router-dom';
import { ContactUsPage } from 'app/pages/ContactUs/Loadable';
import { ContributorOnboarding } from 'app/pages/ContributorOnboarding';
// import { SubscriptionForm } from 'app/pages/SubscriptionForm';
import { MyLibraryPage } from 'app/pages/MyLibraryPage/Loadable';
import { MyTransactionsPage } from 'app/pages/MyTransactions';
import { ChartsPage } from 'app/pages/Charts/Loadable';
import { WelcomePage } from 'app/pages/WelcomePage';
import { DropBox } from 'app/pages/Dropbox';
import { ContributorAdminPage } from 'app/pages/ContributorAdmin';
import { CompleteOrder } from 'app/pages/CompleteOrder';
import { CompleteSubscription } from 'app/pages/CompleteSubscription';
import { AdsPage } from 'app/pages/Ads';
// import { HowToGuidesPage } from 'app/pages/HowToGuides/Loadable';

export const CONTRIBUTOR_ROUTES = [
  {
    path: '/uploader',
    name: 'Uploader',
    exact: true,
    layout: GeneralLayout,
    component: UploaderPage,
  },
  {
    path: '/accounting',
    name: 'Accounting',
    exact: true,
    layout: GeneralLayout,
    component: Accounting,
  },
  {
    path: '/my-media',
    name: 'My Media',
    exact: true,
    layout: GeneralLayout,
    component: ReleaseEditor,
  },
  {
    path: '/cashout',
    name: 'Cashout',
    exact: true,
    layout: GeneralLayout,
    component: CashOutPage,
  },
  {
    path: '/ads',
    name: 'ads',
    exact: true,
    layout: GeneralLayout,
    component: AdsPage,
  },
  {
    path: '/contributor-admin',
    name: 'Contributor Admin',
    exact: true,
    layout: GeneralLayout,
    component: ContributorAdminPage,
  },
];

export const GENERAL_ROUTES = [
  {
    path: '/',
    name: 'Home',
    exact: true,
    layout: GeneralLayout,
    component: () => <Redirect to="/home" />,
  },
  {
    path: '/home',
    name: 'Home',
    exact: true,
    layout: GeneralLayout,
    component: WelcomePage,
  },
  // {
  //   path: '/welcome',
  //   name: 'Welcome',
  //   exact: true,
  //   layout: GeneralLayout,
  //   component: WelcomePage,
  // },
  {
    path: '/charts',
    name: 'Charts',
    exact: true,
    layout: GeneralLayout,
    component: ChartsPage,
  },

  // {
  //   path: '/how-to-guides',
  //   name: 'HowToGuides',
  //   exact: true,
  //   layout: GeneralLayout,
  //   component: HowToGuidesPage,
  // },

  {
    path: '/tracks',
    name: 'Tracks',
    exact: true,
    layout: GeneralLayout,
    component: TracksPage,
  },

  {
    path: '/contributors/:slug',
    name: 'Profile',
    exact: true,
    layout: GeneralLayout,
    component: Profile,
  },
  {
    path: '/tracks/:slug',
    name: 'Tracks',
    exact: true,
    layout: GeneralLayout,
    component: TrackDetailPage,
  },
  {
    path: '/services',
    name: 'Services',
    exact: true,
    layout: GeneralLayout,
    component: Services,
  },
  {
    path: '/multipacks',
    name: 'Multipacks',
    exact: true,
    layout: GeneralLayout,
    component: ReleasesPage,
  },

  {
    path: '/multipacks/:slug',
    name: 'MultipacksDetail',
    exact: true,
    layout: GeneralLayout,
    component: ReleaseDetailPage,
  },

  // {
  //   path: '/playlists/:id',
  //   name: 'PlaylistDetail',
  //   exact: true,
  //   layout: GeneralLayout,
  //   component: PlaylistDetailPage,
  // },
  // {
  //   path: '/playlists',
  //   name: 'Playlists',
  //   exact: true,
  //   layout: GeneralLayout,
  //   component: PlaylistPage,
  // },
  {
    path: '/labels',
    name: 'Labels',
    exact: true,
    layout: GeneralLayout,
    component: LabelsPage,
  },
  {
    path: '/labels/:id',
    name: 'Label',
    exact: true,
    layout: GeneralLayout,
    component: LabelDetailPage,
  },
  {
    path: '/account-setting',
    name: 'AccoutSetting',
    exact: true,
    layout: GeneralLayout,
    component: AccountSettingsPage,
  },
  {
    path: '/contributors',
    name: 'Contributors',
    exact: true,
    layout: GeneralLayout,
    component: CommunityPage,
  },
  {
    path: '/my-library',
    name: 'PurchaseLibrary',
    exact: true,
    layout: GeneralLayout,
    component: MyLibraryPage,
  },
  {
    path: '/my-transactions',
    name: 'MyTransactions',
    exact: true,
    layout: GeneralLayout,
    component: MyTransactionsPage,
  },
  {
    path: '/contact-us',
    name: 'Contact Us',
    exact: true,
    layout: GeneralLayout,
    component: ContactUsPage,
  },
  {
    path: '/contributor-onboarding',
    name: 'Contributor Onboarding',
    exact: true,
    layout: GeneralLayout,
    component: ContributorOnboarding,
  },
  {
    path: '/complete-order',
    name: 'Complete order',
    exact: true,
    layout: GeneralLayout,
    component: CompleteOrder,
  },
  {
    path: '/complete-subscription',
    name: 'Complete subscription',
    exact: true,
    layout: GeneralLayout,
    component: CompleteSubscription,
  },

  // {
  //   path: '/subscription-form',
  //   name: 'Subscription Form',
  //   exact: true,
  //   layout: Empty,
  //   component: SubscriptionForm,
  // },
];

export const AUTH_ROUTES = [
  {
    path: '/auth/login',
    name: 'Login',
    exact: true,
    layout: AuthLayout,
    component: Login,
    restricted: true,
  },
  {
    path: '/auth/signup',
    name: 'Sign up',
    exact: true,
    layout: AuthLayout,
    component: Signup,
    restricted: true,
  },
  {
    path: '/auth/forgot-password',
    name: 'Forgot password',
    exact: true,
    layout: AuthLayout,
    component: ForgotPassword,
    restricted: true,
  },
  {
    path: '/auth/reset-password',
    name: 'Reset password',
    exact: true,
    layout: AuthLayout,
    component: ResetPassword,
    restricted: true,
  },
  {
    path: '/auth/dropbox',
    name: 'dropbox',
    exact: true,
    layout: AuthLayout,
    component: DropBox,
    restricted: true,
  },
];
