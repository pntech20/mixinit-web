import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import styles from './styles.module.scss';

interface DropdownLinkProps {
  name: string;
  icon: JSX.Element;
  items?: Array<DropdownLinkItem>;
}

export interface DropdownLinkItem {
  name: string;
  icon: JSX.Element;
  linkTo?: string;
  divide?: JSX.Element;
  type?: string;
}

export default function DropdownLink(props: DropdownLinkProps) {
  const { name, icon, items = [] } = props;

  return (
    <Box className={styles.container}>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton
            _focus={{
              boxShadow: 'none',
              border: '1px solid none',
              backgroundColor: 'none',
            }}
            _selected={{
              fontWeight: '600',
              textDecoration: 'underline',
            }}
          >
            <Box textAlign="left">
              <Flex alignItems="center">
                <Box w="20px">{icon}</Box>
                <Text fontSize="15px" m="0px 25px">
                  {name}
                </Text>
              </Flex>
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel className={styles.menuContainer}>
            {items.map(it => (
              <Box>
                <NavLink to={it.linkTo} activeClassName={styles.linkActive}>
                  <Box className={styles.sidebarComponents}>
                    <Box className={styles.sidebarIcon}>{it.icon}</Box>
                    <Text ml="22px" fontSize="15px">
                      {it.name}
                    </Text>
                  </Box>
                </NavLink>
                <Box className="divider">{it.divide}</Box>
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
