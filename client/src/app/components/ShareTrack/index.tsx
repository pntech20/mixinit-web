import {
  Box,
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
import TwitterIcon from 'app/assets/icons/twitter-icon.png';
import IconCopyLink from 'app/assets/svgs/IconCopyLink';
import IconFBCopyLink from 'app/assets/svgs/IconFBCopyLink';
import { toastSuccess } from 'app/helpers/toast';
import { useCallback, useMemo } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import styles from './shareTrack.module.scss';

interface ShareTrackProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareTrack({ slug, isOpen, onClose }: ShareTrackProps) {
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/tracks/${slug}`;
  }, [slug]);
  const { onCopy } = useClipboard(shareUrl);

  const handleCopy = useCallback(() => {
    onCopy();
    toastSuccess('Copy link success!');
  }, [onCopy]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="300px">
        <ModalHeader>Share this track</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box className={styles.containerBoxShare}>
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
