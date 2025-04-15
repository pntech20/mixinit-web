import { Box, Checkbox, Flex, Stack, Text } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { PlaylistsFilter, ReleasesFilter } from 'app/models';
interface CheckBoxRadioProps {
  onChangeFilter: (data, key, name) => void;
  filter: ReleasesFilter | PlaylistsFilter;
}

const CheckBoxRadio = ({ onChangeFilter, filter }: CheckBoxRadioProps) => {
  const checkBoxList = [
    {
      type: 'type',
      radioGroup: [
        // {
        //   label: 'Audio',
        //   value: 'Audio',
        //   name: 'showAudio',
        //   checked: showAudio,
        // },
        // {
        //   label: 'Video',
        //   value: 'Video',
        //   name: 'showVideo',
        //   checked: showVideo,
        // },
      ],
    },
    {
      type: 'explicit',
      radioGroup: [
        // {
        //   label: 'Clean',
        //   value: 'Clean',
        //   isImage: true,
        //   name: 'clean',
        //   checked: clean,
        // },
        // {
        //   label: 'Dirty',
        //   value: 'Dirty',
        //   name: 'dirty',
        //   checked: dirty,
        // },
      ],
    },
  ];

  const { boderColor, textColorGrayLight } = useModeTheme();

  return (
    <Flex w="100%" gridGap="15px">
      {(checkBoxList || []).map((item, key: number) => {
        return (
          <Box key={Number(key)} w="47%">
            <Stack direction="column">
              {item.radioGroup.map((value: any, index: number) => {
                return (
                  <Box key={index}>
                    <Checkbox
                      name={value?.name}
                      borderColor={boderColor}
                      h="21px"
                      isChecked={value?.checked}
                      onChange={e => onChangeFilter(e, 'showAudio', 'checkbox')}
                    >
                      <Text
                        fontWeight="400"
                        color={textColorGrayLight}
                        fontSize="11px"
                        mt={value.value !== 'feature' ? '5px' : ''}
                      >
                        {value?.label}
                      </Text>
                    </Checkbox>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        );
      })}
    </Flex>
  );
};

export default CheckBoxRadio;
