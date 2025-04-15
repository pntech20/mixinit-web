import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { useItemCrate } from 'app/hooks/useItemCrate/useItemCrate';
import ItemCrate from 'app/pages/PageCrate/ItemCrate';
import { useEffect } from 'react';
import './styles.scss';

export default function MyCrate({ color = '#fff' }: any) {
  const { onGetMyCrates } = useItemCrate();

  useEffect(() => {
    onGetMyCrates('track');
  }, [onGetMyCrates]);

  return (
    <Box className="dropdow-crate">
      <Menu>
        <MenuButton
          className="menuCrate"
          color={color}
          fontSize={{ base: '14px', md: '16px' }}
          as={Button}
          rightIcon={<ChevronDownIcon marginLeft="-5px" />}
        >
          My Crates
        </MenuButton>
        <MenuList>
          <ItemCrate />
        </MenuList>
      </Menu>
    </Box>
  );
}
