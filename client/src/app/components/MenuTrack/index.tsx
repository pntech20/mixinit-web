import {
  Box,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import ShowHideColumn from 'app/assets/svgs/ShowHideColumn';
import ShowHideColumnLibraryPage from 'app/assets/svgs/ShowHideColumnLibrary.svg';
import { useState } from 'react';
import styles from './index.module.scss';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
interface objectHeaderProps {
  header?: string;
  isShow?: boolean;
}

interface MenuTrackProps {
  defaultFieldDesktop?: Array<objectHeaderProps>;
  setColumnsDesktop: (e) => void;
  columnsDesktopDefault?: any;
  isLibraryPage?: boolean;
}

export default function MenuTrack({
  setColumnsDesktop,
  defaultFieldDesktop,
  columnsDesktopDefault,
  isLibraryPage = false,
}: MenuTrackProps) {
  const { isDarkMode } = useModeTheme();
  const [listHeader, setListHeader] = useState<any>(defaultFieldDesktop);
  const setlistHeaderFilter = (isChecked, header) => {
    let tempt = listHeader;
    const index: number = tempt.findIndex(item => item.header === header);
    tempt[index] = { header, isShow: isChecked };
    filterColumnTable(listHeader);
    setListHeader(tempt);
  };
  const filterColumnTable = listHeader => {
    const tempt: String[] = [];
    listHeader.forEach(item => {
      if (!item.isShow) {
        tempt.push(`${item?.header}`);
      }
    });
    const tempDeskop = columnsDesktopDefault?.filter(
      item => !tempt.includes(`${item?.Header}`),
    );
    setColumnsDesktop(tempDeskop);
  };
  return (
    <>
      <Box>
        <Menu placement="bottom">
          <MenuButton>
            {isLibraryPage ? (
              <Box>
                <Text className={styles.ShowHideColumn}>show/hide</Text>
                <Image
                  margin="auto"
                  w="20px"
                  filter={isDarkMode ? 'invert(1)' : 'unset'}
                  src={ShowHideColumnLibraryPage}
                />
                <Text className={styles.ShowHideColumn}>columns</Text>
              </Box>
            ) : (
              <ShowHideColumn />
            )}
          </MenuButton>
          <Portal>
            <MenuList>
              {listHeader.map(column => (
                <MenuItem className={styles.menuItem} key={column.header}>
                  <label className={styles.label}>
                    <input
                      onClick={(e: any) => {
                        setlistHeaderFilter(e?.target?.checked, column.header);
                      }}
                      checked={column.isShow}
                      type="checkbox"
                      className={styles.input}
                    />
                    {column.header}
                  </label>
                </MenuItem>
              ))}
            </MenuList>
          </Portal>
        </Menu>
      </Box>
    </>
  );
}
