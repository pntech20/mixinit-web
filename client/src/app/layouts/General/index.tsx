import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { TopMenu } from 'app/components/Header';
import { SIDEBAR_NAVIGATION } from 'app/constants/enum';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useCallback, useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
import styles from './general.module.scss';

interface GeneralLayoutProps {
  children: JSX.Element;
}

export default function GeneralLayout({ children }: GeneralLayoutProps) {
  const smVariant = {
    navigation: SIDEBAR_NAVIGATION.DRAWER,
    navigationButton: true,
  };

  const mdVariant = {
    navigation: SIDEBAR_NAVIGATION.SIDEBAR,
    navigationButton: false,
  };

  const variants = useBreakpointValue({ base: smVariant, xl: mdVariant });

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [offSetTopLayout, setOffSetTopLayout] = useState(0);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const { isAudioPlay, isUseInput } = usePlayers();

  const {
    isLargerThan860,
    isLargerThan1280,
    isLargerThan1440,
    isSmallerThan500,
  } = useMediaScreen();

  const handleKeyPress = useCallback(
    event => {
      const { key } = event;

      if (!isUseInput) {
        if (['ArrowLeft'].includes(key) && !isAudioPlay) {
          setOffSetTopLayout(prev => (prev <= 50 ? 0 : prev - 50));
        }
        if (['ArrowRight'].includes(key) && !isAudioPlay) {
          setOffSetTopLayout(prev => prev + 50);
        }
      }
    },
    [isAudioPlay, isUseInput],
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const element = document.getElementById('layout');
    element?.scrollTo({
      top: offSetTopLayout,
      behavior: 'smooth',
    });
  }, [offSetTopLayout]);

  return (
    <Box className={styles.general} id="layout">
      <TopMenu
        isShowSidebar={variants?.navigationButton}
        onShowSidebar={toggleSidebar}
      />
      {!isLargerThan1280 && (
        <Box display={{ base: 'none', xl: 'flex' }}>
          <Sidebar
            variant={variants?.navigation}
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
          />
        </Box>
      )}
      <Flex className={styles.sidebarComponents} maxW="1440px">
        <Flex
          w="100%"
          padding={
            isLargerThan1440
              ? '13px 0px 70px 0px'
              : isLargerThan860
              ? '13px 15px 70px'
              : isSmallerThan500
              ? '13px 5px 70px 5px'
              : '13px 16px 70px 16px'
          }
          paddingBottom={isAudioPlay ? '70px' : '0px'}
        >
          <Content>{children}</Content>
        </Flex>
      </Flex>
      <CookieConsent
        location="bottom"
        buttonText="Accept All Cookies"
        declineButtonText="Reject Unnecessary"
        enableDeclineButton
        cookieName="myCookieConsent"
        buttonWrapperClasses="button-container"
        buttonStyle={{
          backgroundColor: '#11c621',
          color: '#fff',
          fontSize: '14px',
          borderRadius: '5px',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          margin: '0px',
        }}
        declineButtonStyle={{
          backgroundColor: '#5C94E8',
          color: '#fff',
          fontSize: '14px',
          borderRadius: '5px',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          margin: '0px',
        }}
        expires={365}
      >
        By clicking 'Accept All Cookies', you consent to storing cookies on your
        device to improve site navigation, analyze usage, and support marketing
        efforts. By using this site, you agree to our Terms of Service, Privacy
        Policy, and Cookie Policy, which include provisions on arbitration and
        class action waivers.
      </CookieConsent>
    </Box>
  );
}
