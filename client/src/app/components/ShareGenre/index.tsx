import {
  Box,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import BackgroundGenre from 'app/assets/banners/official-top-10-list.png';
import TwitterIcon from 'app/assets/icons/twitter-icon.png';
import IconCopyLink from 'app/assets/svgs/IconCopyLink';
import IconFBCopyLink from 'app/assets/svgs/IconFBCopyLink';
import { toastSuccess } from 'app/helpers/toast';
import { useCallback, useMemo } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import styles from './shareGenre.module.scss';

interface ShareGenreProps {
  genre: any;
  isOpen: boolean;
  setIsOpen: (e) => void;
}

export default function ShareGenre({
  genre,
  isOpen,
  setIsOpen,
}: ShareGenreProps) {
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/tracks?genreId=${
      genre?.genre._id
    }&label=${genre?.genre.name}&date=${genre?.selectedTime || 'all'}`;
  }, [genre?.genre._id, genre?.genre.name, genre?.selectedTime]);

  const { onCopy } = useClipboard(shareUrl);

  const handleCopy = useCallback(() => {
    onCopy();
    toastSuccess('Copy link success!');
  }, [onCopy]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
      <ModalOverlay />
      <ModalContent maxW="300px">
        <ModalHeader>Share this genre</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box className={styles.containerBoxShare}>
            <Flex alignItems="center" gridGap="9px">
              <Image
                borderRadius="2px"
                width="40px"
                height="40px"
                objectFit="cover"
                src={BackgroundGenre}
              />
              <Text className={styles.textTrack}>{genre?.genre?.name}</Text>
            </Flex>
            <Divider margin="18px 0px" />
            <Flex className={styles.btnShare} onClick={handleCopy}>
              <IconCopyLink />
              <Text className={styles.textShare}>Copy Link</Text>
            </Flex>

            <FacebookShareButton url={shareUrl} style={{ width: '100%' }}>
              <Flex className={styles.btnShare}>
                <IconFBCopyLink />
                <Text className={styles.textShare}>Share On Facebook</Text>
              </Flex>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} style={{ width: '100%' }}>
              <Flex className={styles.btnShare}>
                <Image src={TwitterIcon} width="14px" height="14px" />
                <Text className={styles.textShare}>Share On Twitter</Text>
              </Flex>
            </TwitterShareButton>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
