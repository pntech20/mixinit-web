import { useColorMode } from '@chakra-ui/color-mode';
import { Image } from '@chakra-ui/image';
import { Box, Text } from '@chakra-ui/layout';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoIosCloseCircle } from 'react-icons/io';
interface DropZoneFileProps {
  passFile: (acceptedFiles: any) => void;
  handleRemoveImage: () => void;
  label: string;
  defaultFile: any;
  isDropZoneProfile?: any;
  squareImage?: boolean;
  spinning?: boolean;
  isMyMedia?: boolean;
  className?: string;
}

function DropZoneImage({
  defaultFile,
  passFile,
  label,
  handleRemoveImage,
  isDropZoneProfile,
  squareImage = false,
  spinning = false,
  isMyMedia = false,
  className = '',
}: DropZoneFileProps) {
  const onDrop = useCallback(
    acceptedFiles => {
      setFile(URL.createObjectURL(acceptedFiles[0]));
      passFile(acceptedFiles[0]);
    },
    [passFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDrop,
  });
  const [file, setFile] = useState<any>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setFile(defaultFile);
  }, [defaultFile]);

  const removeImage = useCallback(() => {
    setFile(null);
    handleRemoveImage();
  }, [handleRemoveImage]);

  return (
    <>
      {file ? (
        <Box
          className={`drop-zone-image  ${
            squareImage ? 'drop-zone-image-square' : ''
          } drop-zone-media`}
          margin="0 auto"
        >
          <Image
            src={file}
            alt=""
            className={isDropZoneProfile && 'drop-profile-img'}
            width={squareImage ? '250px' : '100%'}
            height={squareImage ? '250px' : '100%'}
          />
          <IoIosCloseCircle
            className="icon-close"
            cursor="pointer"
            onClick={removeImage}
          />
        </Box>
      ) : (
        <div
          {...getRootProps({
            className: `drop-zone-file ${
              squareImage ? 'square-image' : ''
            } drop-zone-file-${colorMode}`,
          })}
        >
          <input {...getInputProps()} />
          <Text
            className={isDropZoneProfile && 'content-drop-profile'}
            fontSize="20px !important"
          >
            {label}
          </Text>
        </div>
      )}
    </>
  );
}

export default DropZoneImage;
