import { Box, Image } from '@chakra-ui/react';
import { IMAGE_TYPE, PLAYLIST_TYPE } from 'app/constants/enum';
import { useState, useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './previewImage.module.scss';

interface PreivewImagesProps {
  preview: any;
  type?: string;
  handleClose: (e) => void;
}

export default function PreivewImages({
  preview,
  type,
  handleClose,
}: PreivewImagesProps) {
  const [isImage, setIsImage] = useState<boolean>(false);

  useEffect(() => {
    const getExtension = filename => {
      var parts = filename.split('.');
      return parts[parts.length - 1];
    };

    const isExistImage = filename => {
      var ext = getExtension(filename);
      switch (ext.toLowerCase()) {
        case IMAGE_TYPE.JPG:
        case IMAGE_TYPE.GIF:
        case IMAGE_TYPE.BMP:
        case IMAGE_TYPE.PNG:
          return true;
      }
      return type === 'img';
    };
    if (typeof preview === 'string') {
      setIsImage(isExistImage(preview));
    }
  }, [setIsImage, preview, type]);

  return (
    <Box className={styles.preview} position="relative" marginTop="30px">
      <Box
        position="absolute"
        onClick={handleClose}
        cursor="pointer"
        left="40px"
        top="-8px"
      >
        <AiOutlineCloseCircle />
      </Box>
      {preview.type === PLAYLIST_TYPE.IMAGE && (
        <Image className={styles.previewMedia} src={preview.url} alt="" />
      )}
      {preview.type === PLAYLIST_TYPE.VIDEO && (
        <video className={styles.previewMedia} src={preview.url} />
      )}
      {typeof preview === 'string' &&
        (isImage ? (
          <Image className={styles.previewMedia} src={preview} alt="" />
        ) : (
          <video className={styles.previewMedia} src={preview} />
        ))}
      <Box
        position="absolute"
        onClick={handleClose}
        cursor="pointer"
        left="40px"
        top="-8px"
      >
        <AiOutlineCloseCircle />
      </Box>
    </Box>
  );
}
