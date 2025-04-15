import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../Login/slice/selectors';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import useSidebarData from 'app/layouts/General/components/Sidebar/useSidebarData';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useCallback, useContext } from 'react';
import styles from './contributorAdmin.module.scss';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';

export function ContributorAdminPage() {
  const { userDetail } = useSelector(selectAuth);
  const { contributorMenu, isConfirmContributor } = useSidebarData();
  const { pageHeader }: any = useContext(PageHeaderContext);

  const { isLightMode, isDarkMode } = useModeTheme();

  const { isLargerThan780, isLargerThan1024, isLargerThan900 } =
    useMediaScreen();

  const renderNavLink = useCallback(
    (item: any) => {
      return item.name === "Editor's Guide" ? (
        <Center
          bg="black"
          color="white"
          h="34px"
          borderRadius={'5px'}
          px="15px"
        >
          <a
            href="https://www.crooklynclan.net/ccv4-contributor-onboarding"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: isLargerThan900 ? '16px' : '14px',
              fontWeight: 600,
            }}
          >
            Editor's Guide
          </a>
        </Center>
      ) : (
        <Center
          bg="black"
          color="white"
          h="34px"
          borderRadius={'5px'}
          px="15px"
        >
          <NavLink
            activeClassName={classNames(
              !isLightMode ? [styles.linkActiveDark] : [styles.linkActiveLight],
            )}
            className={classNames(
              !isLightMode ? [styles.menuLinkDark] : [styles.menuLinkLight],
            )}
            to={item?.linkTo}
            href={item?.linkTo}
            key={item?.linkTo}
          >
            <Text
              className={classNames(
                !isLightMode ? [styles.menuLinkDark] : [styles.menuLinkLight],
              )}
              fontWeight="600"
              fontSize={isLargerThan900 ? '16px' : '14px'}
              key={item.name}
              alignItems="center"
              paddingLeft={item?.name === 'Home' ? '0px !important' : 'unset'}
            >
              {item.name}
            </Text>
          </NavLink>
        </Center>
      );
    },
    [isLargerThan900, isLightMode],
  );

  return (
    <Box>
      {userDetail?.isContributor && isLargerThan780 && !isConfirmContributor && (
        <Flex
          alignItems="center"
          gridGap={isLargerThan1024 ? '10px' : '5px'}
          mt={6}
          mb={4}
        >
          {contributorMenu.map(item => renderNavLink(item))}
        </Flex>
      )}
      <Text
        fontSize={44}
        lineHeight="44px"
        // fontWeight={700}
        fontFamily={'Impact'}
        color={isDarkMode ? '#ffffff' : '#333333'}
        mb={2}
      >
        Welcome Contributors
      </Text>
      {pageHeader?.contributorAdmin && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.contributorAdmin)}
        </Box>
      )}
    </Box>
  );
}
