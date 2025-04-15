import {
  Box,
  Flex,
  Input,
  Text,
  useColorMode,
  Button,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { TracksFilter } from 'app/apis/track/type';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useCrates } from 'app/hooks/Crates/useCrate';
import { useCratesSlice } from 'app/pages/PageCrate/slice';
import { selectSliceCrates } from 'app/pages/PageCrate/slice/selector';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import './styles.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';
import ItemCrate from 'app/pages/PageCrate/ItemCrate';
interface Props {
  filter?: any;
  onClear?: any;
  handleSaveCrate: (filter: TracksFilter) => void;
}

export default function FilterCrate({
  filter,
  handleSaveCrate,
  onClear,
}: Props) {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { t } = useTranslation();
  const { textColorGrayLight, textColor } = useModeTheme();
  const { colorMode } = useColorMode();
  const { isSaveCrate, valueNameCrate, filterRules } =
    useSelector(selectSliceCrates);

  const { onUpdateCrate } = useCrates();
  const { actions } = useCratesSlice();
  const dispatch = useDispatch();

  return (
    <Box w="100%" padding="5px" border="1px solid #ebe3e3" borderRadius="5px">
      <Text fontWeight="700" fontSize="25px" color={textColor}>
        SAVE CRATE
      </Text>
      <Text
        fontWeight="600"
        fontSize="12px"
        mb="10px"
        color={textColorGrayLight}
      >
        {t('crate.saveYourSearch')}
      </Text>
      <Box justifyContent="flex-end">
        <Flex w="100%" mb="10px">
          <Input
            className={`btn-save-filter-crate btn-crate btn-crate-${colorMode}`}
            type="text"
            placeholder={t('music.advFilters.nameThisCreate')}
            onChange={e => dispatch(actions.addString(e.target.value))}
            defaultValue={valueNameCrate}
            value={valueNameCrate}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Flex>
        <Flex>
          <Flex w="100%" justifyContent="center">
            <Input
              px="8px !important"
              borderRadius="5px !important"
              backgroundColor="#0082F3 !important"
              className="btn-save-filter-crate btn-save"
              value={`${
                isSaveCrate ? t('crate.updateCrate') : t('crate.saveCrate')
              }`}
              onClick={() => {
                onClear();
                isSaveCrate ? onUpdateCrate(filter) : handleSaveCrate(filter);
              }}
              type="submit"
              cursor="pointer"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </Flex>
          {isSaveCrate && filterRules.name !== valueNameCrate && (
            <Flex w="100%" justifyContent="center" ml="10px">
              <Input
                px="8px !important"
                borderRadius="5px !important"
                backgroundColor="#0082F3 !important"
                className="btn-save-filter-crate btn-save"
                value={`${t('crate.saveCrate')}`}
                onClick={() => {
                  onClear();
                  handleSaveCrate(filter);
                }}
                type="submit"
                cursor="pointer"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </Flex>
          )}
        </Flex>
        <Menu>
          <MenuButton
            w="100%"
            mt="10px"
            as={Button}
            fontSize="12px"
            fontWeight="600"
            padding="0px"
            color={textColor}
          >
            {t('header.myCrates')}
          </MenuButton>
          <MenuList>
            <ItemCrate />
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
}
