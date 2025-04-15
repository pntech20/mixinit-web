import { Box, Checkbox, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import InputSearch from 'app/components/InputSearch';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Search({
  placeHolder,
  handleChange,
  searchValue,
  mb,
  filter,
  handleFilterCheckbox,
  isShowCheckboxs,
}: {
  placeHolder: string;
  handleChange: any;
  searchValue: string;
  mb?: any;
  filter?: any;
  handleFilterCheckbox?: any;
  isShowCheckboxs?: boolean;
}) {
  const checkBoxDefault = useMemo(
    () => [
      {
        label: 'Audio',
        value: 'Audio',
        name: 'showAudio',
        checked: filter?.showAudio,
      },
      {
        label: 'Video',
        value: 'Video',
        name: 'showVideo',
        checked: filter?.showVideo,
      },

      {
        label: 'Clean',
        value: 'Clean',
        isImage: true,
        name: 'clean',
        checked: filter?.clean,
      },
      {
        label: 'Dirty',
        value: 'Dirty',
        name: 'dirty',
        checked: filter?.dirty,
      },
    ],
    [filter?.clean, filter?.dirty, filter?.showAudio, filter?.showVideo],
  );
  const checkBox = useMemo(
    () => [
      {
        label: 'Audio',
        value: 'Audio',
        name: 'showAudio',
        checked: filter?.showAudio,
      },
      {
        label: 'Video',
        value: 'Video',
        name: 'showVideo',
        checked: filter?.showVideo,
      },

      {
        label: 'Clean',
        value: 'Clean',
        isImage: true,
        name: 'clean',
        checked: filter?.clean,
      },
      {
        label: 'Dirty',
        value: 'Dirty',
        name: 'dirty',
        checked: filter?.dirty,
      },
      {
        label: 'Favorites Only',
        value: 'Favorites',
        name: 'showFavoriteByMe',
        checked: filter?.showFavoriteByMe,
      },
    ],
    [
      filter?.clean,
      filter?.dirty,
      filter?.showAudio,
      filter?.showFavoriteByMe,
      filter?.showVideo,
    ],
  );
  const { pathname } = useLocation();
  const [checkBoxList, setCheckBoxList] = useState(checkBoxDefault);
  const isMyMedia = pathname.includes('/my-media');

  useEffect(() => {
    setCheckBoxList(isMyMedia ? checkBoxDefault : checkBox);
  }, [checkBox, checkBoxDefault, isMyMedia]);
  return (
    <Box w="100%" mb={mb}>
      {!isShowCheckboxs ? (
        <Text
          fontSize="12px"
          fontWeight="600"
          // eslint-disable-next-line react-hooks/rules-of-hooks
          color={useColorModeValue('#616161', '#fff')}
        >
          Search and filter the table to find exactly what you are looking for!
        </Text>
      ) : (
        <Flex w="100%" gridGap="15px" h="20px">
          {(checkBoxList || []).map((value, index) => {
            return (
              <Box key={index}>
                <Checkbox
                  name={value?.name}
                  isChecked={value?.checked}
                  onChange={e =>
                    handleFilterCheckbox(e.target.name, e.target.checked)
                  }
                >
                  <Text fontWeight="400" fontSize="11px">
                    {value?.label}
                  </Text>
                </Checkbox>
              </Box>
            );
          })}
        </Flex>
      )}
      <InputSearch
        value={searchValue}
        placeholder={placeHolder}
        onChange={handleChange}
      />
    </Box>
  );
}
