import { Flex } from '@chakra-ui/react';
import { AUDIO, MP3_320KBPS_FILE, MP4, VIDEO } from 'app/constants';
import { formatTime } from 'app/utils/date';
import { useTranslation } from 'react-i18next';
import styles from './additionalInfo.module.scss';

export default function AdditionalInfo({ track }) {
  const { t } = useTranslation();
  const returnValue = type => {
    const fileInfos = {
      [AUDIO]: MP3_320KBPS_FILE,
      [VIDEO]: MP4,
    };
    const value = fileInfos[type];
    return value;
  };

  return (
    <Flex
      className={styles.additonalInfo}
      p="10px"
      justifyContent="space-between"
    >
      {/* <Text>
        Key: {`${track?.trackKey?.musicKey} / ${track?.trackKey?.camelotKey}`}
      </Text> */}
      <p>{returnValue(track?.type)}</p>

      <p>
        {t('uploader.length')}: {formatTime(track?.duration)}
      </p>
      <p>{track?.fileSize}MB</p>
    </Flex>
  );
}
