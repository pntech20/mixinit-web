import { ChakraProvider } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  getJwtLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from 'app/helpers/local-storage';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPageHeaderApi } from './apis/pageHeaders';
import { FooterPlayer } from './components/FooterPlayer';
import { Loading } from './components/Loading/Loadable';
import theme from './config/theme';
import {
  COUNTRY,
  IP_ADDRESS,
  IS_REDIRECT_URL,
  REDIRECT_URL,
} from './constants';
import { PageHeaderContext } from './contexts/PageHeaderContext';
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { usePlayers } from './hooks/player/usePlayers';
import { useSubscriptions } from './hooks/subscription/useSubscriptions';
import { useWishlists } from './hooks/wishlist/useWishlists';
import CheckNeedConfirmContributorMiddleware from './middleware/CheckNeedConfirmContributorMiddleware';
import { useAuthSlice } from './pages/Login/slice';
import { selectAuth } from './pages/Login/slice/selectors';
import { RenderRoutes } from './routes/RenderRoutes';

export function App() {
  // const [password, setPassword] = useState<string>('');
  // const [isVerified, setIsVerified] = useState(false);

  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();
  const { isSessionFetched } = useSelector(selectAuth);
  const { isAudioPlay, playingTrack, isUseInput } = usePlayers();
  const { getMySubscription } = useSubscriptions();
  const [pageHeader, setPageHeader] = useState<any>(null);
  const { onGetMyWishlists } = useWishlists();
  const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID || '';
  // const isConfirmSuccess = getLocalStorage('lrg5j7xmn9mw7pf');

  // const onSubmit = () => {
  //   if (password === process.env.REACT_APP_PASSWORD_SITE) {
  //     setIsVerified(true);
  //     setLocalStorage('lrg5j7xmn9mw7pf', true);
  //   } else {
  //     toastError('Password incorrect');
  //   }
  // };

  // useEffect(() => {
  //   if (!isEmpty(isConfirmSuccess) && isConfirmSuccess) {
  //     setIsVerified(true);
  //   } else {
  //     setIsVerified(false);
  //   }
  // }, [isConfirmSuccess]);

  const getData = async () => {
    const res = await axios.get('https://ip.nf/me.json');
    setLocalStorage(IP_ADDRESS, res?.data?.ip?.ip);
    setLocalStorage(COUNTRY, res?.data?.ip?.country);
  };

  const getPageHeader = async () => {
    const data: any = await getPageHeaderApi();
    if (data) {
      setPageHeader(data?.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isSessionFetched) {
      getPageHeader();
      getMySubscription();
    }
  }, [dispatch, getMySubscription, isSessionFetched]);

  useEffect(() => {
    if (isSessionFetched) {
      onGetMyWishlists();
    }
  }, [isSessionFetched, onGetMyWishlists]);

  useEffect(() => {
    const accessToken = getJwtLocalStorage();
    if (
      (!window.location.pathname.startsWith('/auth') && !isSessionFetched) ||
      (window.location.pathname.startsWith('/auth') && !!accessToken)
    ) {
      dispatch(actions.getMe());
    }
  }, [actions, dispatch, isSessionFetched, onGetMyWishlists]);

  useEffect(() => {
    const isRedirect = getLocalStorage(IS_REDIRECT_URL);
    if (
      !window.location.pathname.startsWith('/auth') &&
      !isSessionFetched &&
      !isRedirect
    ) {
      setLocalStorage(REDIRECT_URL, window.location.href);
    }
  }, [actions, dispatch, isSessionFetched, onGetMyWishlists]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const handleKeyPress = useCallback(
    event => {
      const { key } = event;
      if ([' '].includes(key) && playingTrack && !isUseInput) {
        event.preventDefault();
      }
    },
    [isUseInput, playingTrack],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <ChakraProvider theme={theme}>
      <GoogleOAuthProvider clientId={clientId}>
        <PageHeaderContext.Provider
          value={{
            pageHeader,
          }}
        >
          <WebsocketProvider value={socket}>
            <BrowserRouter>
              <Helmet
                titleTemplate="%s - Crooklyn Clan"
                defaultTitle="Crooklyn Clan"
                htmlAttributes={{ lang: i18n.language }}
              >
                <meta name="description" content="Crooklyn Clan" />
              </Helmet>
              <CheckNeedConfirmContributorMiddleware />

              <RenderRoutes />

              <ToastContainer autoClose={3000} theme="colored" />
              {isAudioPlay && <FooterPlayer />}
              <Loading />
            </BrowserRouter>
          </WebsocketProvider>
        </PageHeaderContext.Provider>
      </GoogleOAuthProvider>
    </ChakraProvider>
  );
}
