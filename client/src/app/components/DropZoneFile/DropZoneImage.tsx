import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';
import { Flex, Text, Image as Img } from '@chakra-ui/react';
import { toastError } from 'app/helpers/toast';
import classnames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaRegWindowClose } from 'react-icons/fa';
import styles from './dropZoneFile.module.scss';
interface DropZoneFileProps {
  passFile: (acceptedFiles: any) => void;
  handleRemoveImage: () => void;
  label: string;
  defaultFile: string;
  isDropZoneProfile?: boolean;
  editProfile?: boolean;
  spinning?: boolean;
  isMyMedia?: boolean;
  isMyMedia500px?: boolean;
  className?: string;
}

function DropZoneImage({
  defaultFile,
  passFile,
  label,
  handleRemoveImage,
  isDropZoneProfile,
  spinning = false,
  editProfile = false,
  isMyMedia = false,
  isMyMedia500px = false,
  className = '',
}: DropZoneFileProps) {
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach(file => {
        const img = new Image();
        if (file.type.startsWith('image/')) {
          img.src = URL.createObjectURL(file);
          img.addEventListener('load', function () {
            if (
              (!isMyMedia500px &&
                (img.width !== 1080 || img.height !== 1080)) ||
              (isMyMedia500px && (img.width !== 500 || img.height !== 500))
            ) {
              toastError(
                `Image must be ${
                  isMyMedia500px ? '500x500' : '1080x1080'
                } pixels.`,
              );
            } else {
              setFile(URL.createObjectURL(acceptedFiles[0]));
              passFile(acceptedFiles[0]);
            }
          });
        }
      });
    },
    [isMyMedia500px, passFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDrop,
  });
  const { colorMode } = useColorMode();

  const { t } = useTranslation();
  const [file, setFile] = useState<any>(null);

  useEffect(() => {
    setFile(defaultFile);
  }, [defaultFile]);

  const removeImage = useCallback(() => {
    setFile(null);
    handleRemoveImage();
  }, [handleRemoveImage]);

  return (
    <Box
      className={classnames(
        styles.dropZoneFile,
        styles[`dropZoneFile${colorMode}`],
      )}
    >
      {file ? (
        <div
          className={classnames(styles.dropZoneImage, styles.dropZoneMedia, {
            [styles.editProfile]: editProfile,
          })}
        >
          <FaRegWindowClose
            className={classnames(
              styles.iconClose,
              styles[`iconClose${colorMode}`],
            )}
            onClick={removeImage}
          />
          <Img
            src={file}
            alt=""
            className={classnames(
              isDropZoneProfile
                ? [styles.dropProfileImg]
                : isMyMedia
                ? [styles.myMedia]
                : '',
            )}
          />
        </div>
      ) : (
        <div
          {...getRootProps({
            className: editProfile
              ? styles.editProfile
              : isMyMedia
              ? styles.imageMyMedia
              : styles.dropZoneMedia,
          })}
        >
          <input {...getInputProps()} />
          <Flex flexDir="column">
            <Text
              className={classnames(
                isDropZoneProfile
                  ? [styles.contentDropProfile]
                  : isMyMedia
                  ? [styles.textMyMedia]
                  : '',
              )}
            >
              {label}
            </Text>
          </Flex>

          {editProfile && <p>{t('profile.optimal')}</p>}
        </div>
      )}
    </Box>
  );
}

export default DropZoneImage;
