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
import logoIcon from 'app/assets/images/logo/cast.png';
import IconCopyLink from 'app/assets/svgs/IconCopyLink';
import IconFBCopyLink from 'app/assets/svgs/IconFBCopyLink';
import TwitterIcon from 'app/assets/icons/twitter-icon.png';
import { Nullable } from 'app/constants/types';
import { toastSuccess } from 'app/helpers/toast';
import { Playlist, Release } from 'app/models';
import { useCallback, useMemo } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import styles from './shareMedia.module.scss';

interface ShareMediaProps {
  dataShare: Nullable<Release> | Nullable<Playlist>;
  isOpen: boolean;
  isplaylist?: boolean;
  onClose: () => void;
}

export default function ShareMedia({
  dataShare,
  isplaylist,
  isOpen,
  onClose,
}: ShareMediaProps) {
  const shareUrl = useMemo(() => {
    return window.location.href;
  }, []);

  const { onCopy } = useClipboard(shareUrl);

  const handleCopy = useCallback(() => {
    onCopy();
    toastSuccess('Copy link success!');
  }, [onCopy]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="300px">
        <ModalHeader>
          Share this {isplaylist ? 'playlists' : 'releases'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box className={styles.containerBoxShare}>
            <Flex alignItems="center" gridGap="9px">
              <Image
                borderRadius="2px"
                width="40px"
                height="40px"
                objectFit="cover"
                src={dataShare?.artwork || logoIcon}
              />
              <Box>
                <Text className={styles.textTrack}>{dataShare?.title}</Text>
                <Text className={styles.textTrack}>
                  {dataShare?.user?.username}
                </Text>
              </Box>
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
