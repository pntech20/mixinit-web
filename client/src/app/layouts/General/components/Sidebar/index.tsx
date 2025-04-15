import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SIDEBAR } from 'app/constants/enum';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useAuthSlice } from 'app/pages/Login/slice';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import DropdownLink from '../DropdownLink';
import styles from './sidebar.module.scss';
import useSidebarData from './useSidebarData';

interface Props {
  onClose: () => void;
  isOpen: boolean;
  variant?: any;
}

export default function Sidebar({ variant, isOpen, onClose }: Props) {
  const { menuList = [] } = useSidebarData();

  const dispatch = useDispatch();
  const { actions } = useAuthSlice();
  const { isDarkMode } = useModeTheme();

  const SideBarContent = useCallback(() => {
    const handleLogout = () => {
      dispatch(actions.logout());
    };

    const renderAnotherType = item => {
      if (item?.type === SIDEBAR.DROPDOWN_LINK) {
        return (
          <DropdownLink name={item.name} icon={item.icon} items={item?.items} />
        );
      }

      if (item.type === 'logout') {
        return (
          <Box
            className={styles.sidebarComponents}
            paddingBottom="20px"
            onClick={handleLogout}
            cursor="pointer"
          >
            {item.icon}
            <Text ml="24px" fontSize="14px">
              {item.name}
            </Text>
          </Box>
        );
      }

      return <Box />;
    };

    const isBorderBottom = isDarkMode
      ? '0.2px solid rgb(255, 255, 255,0.2)'
      : '0.2px solid rgb(128, 128, 128,0.2)';

    return (
      <VStack
        p="30px 16px"
        pt={{ lg: '60px' }}
        pl={{ lg: '10px' }}
        pr={{ lg: '10px' }}
        className={classNames(styles.sidebarContent)}
        h={{ base: 'calc(100% - 82px)', md: '100%' }}
      >
        {menuList.map((item, index) => {
          const isBorder = index % 8 === 0 && index > 0;
          const isPadding = index % 7 === 0 && index > 0;
          return (
            <React.Fragment key={index}>
              {item.linkTo ? (
                <Box
                  pt={isBorder ? '26px' : '0px'}
                  borderTop={isBorder ? isBorderBottom : ''}
                >
                  <NavLink
                    onClick={onClose}
                    to={item.linkTo}
                    activeClassName={styles.linkActive}
                  >
                    <Box
                      mb={isPadding ? '18px' : '26px'}
                      className={styles.sidebarComponents}
                    >
                      <Box className={styles.sidebarIcon}>{item.icon}</Box>
                      <Text ml="22px" fontSize="15px">
                        {item.name}
                      </Text>
                    </Box>
                  </NavLink>
                  <Box className="divider">{item.divide}</Box>
                </Box>
              ) : (
                renderAnotherType(item)
              )}
            </React.Fragment>
          );
        })}
      </VStack>
    );
  }, [actions, dispatch, isDarkMode, menuList, onClose]);

  return (
    <>
      <Drawer isOpen={isOpen} onClose={() => onClose()} placement="left">
        <DrawerOverlay>
          <DrawerContent top="60px !important" w="280px !important">
            <DrawerBody>
              <SideBarContent />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
