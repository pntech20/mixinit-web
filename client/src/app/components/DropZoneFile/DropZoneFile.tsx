import { Box, Text } from '@chakra-ui/react';
import { toastError } from 'app/helpers/toast';
import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@chakra-ui/color-mode';
import styles from './dropZoneFile.module.scss';
import classnames from 'classnames';
import { AUDIO } from 'app/constants';

interface DropZoneFileProps {
  passFile: (acceptedFiles: Array<File>) => void;
  type: string;
  accept?: string;
  showTracksBecomeVisibe?: boolean;
}

function DropzoneFile({
  passFile,
  type,
  accept,
  showTracksBecomeVisibe = true,
}: DropZoneFileProps) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length) {
        passFile(acceptedFiles);
      }
    },
    [passFile],
  );

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: type,
    onDrop,
  });

  useEffect(() => {
    if (fileRejections.length) {
      toastError(t('uploader.acceptTypeFile'));
    }
  }, [fileRejections, t]);

  return (
    <Box
      {...getRootProps({
        className: classnames(
          styles.dropZoneFile,
          styles[`dropZoneFile${colorMode}`],
        ),
      })}
    >
      <input {...getInputProps()} />
      <Box width="100%">
        <Text className={styles.textTitle}>{t('uploader.dropZone')}</Text>
        {accept === AUDIO ? (
          <Text fontSize="16px !important">{t('uploader.audioFilesMust')}</Text>
        ) : (
          <Text fontSize="16px !important">{t('uploader.videoFilesMust')}</Text>
        )}
        <Text fontSize="20px !important" color="red !important">
          {showTracksBecomeVisibe && t('uploader.tracksBecomeVisibe')}
        </Text>
      </Box>
    </Box>
  );
}

export default DropzoneFile;
