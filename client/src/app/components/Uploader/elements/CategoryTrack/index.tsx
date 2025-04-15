import { Box, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import styles from './categoryTrack.module.scss';
import { useTranslation } from 'react-i18next';

interface prop {
  handleSongEdit: any;
  contributorRating: string;
}

export default function CategoryTrack({
  handleSongEdit,
  contributorRating,
}: prop) {
  const { t } = useTranslation();

  const isOpening = contributorRating === 'opening';

  return (
    <Box my="10px">
      <label>
        <Text as="span" color="red">
          *
        </Text>{' '}
        {t('uploader.whichCategory')}
      </label>
      <RadioGroup
        onChange={value => handleSongEdit('contributorRating', value)}
        value={contributorRating}
      >
        <Stack direction="row">
          <Radio id="opening" value="opening" hidden margin="0px">
            <Box
              marginLeft="-8px"
              className={styles.category}
              color={isOpening ? '#000' : '#9c9c9c'}
              backgroundColor={isOpening ? '#73ff02' : '#f7f7f7'}
              borderWidth="1px"
              borderColor={isOpening ? '#73ff02' : '#bbb'}
            >
              Opening
            </Box>
          </Radio>
          <Radio id="primetime" value="primetime" hidden>
            <Box
              marginLeft="-8px"
              className={styles.category}
              color={contributorRating === 'primetime' ? '#000' : '#9c9c9c'}
              backgroundColor={
                contributorRating === 'primetime' ? '#73ff02' : '#f7f7f7'
              }
              borderWidth="1px"
              borderColor={
                contributorRating === 'primetime' ? '#73ff02' : '#bbb'
              }
            >
              Primetime
            </Box>
          </Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
}
