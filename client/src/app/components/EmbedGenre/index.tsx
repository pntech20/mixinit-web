import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { CopyBlock, github } from 'react-code-blocks';
import styles from './embedGenre.module.scss';

interface EmbedGenreProps {
  genreItem: any;
  isOpen: boolean;
  setIsOpen: (e) => void;
}

export default function EmbedGenre({
  genreItem,
  isOpen,
  setIsOpen,
}: EmbedGenreProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
      <ModalOverlay />
      <ModalContent maxW="900px" background="#ccc">
        <ModalHeader>Share this genre Externally</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box className={styles.containerBoxShare}>
            <Text>1. Put snippet code below to the end of your body tag.</Text>
            <CopyBlock
              text={`<link rel="stylesheet" href="https://test-999111.s3.amazonaws.com/main.058b265d.css" />`}
              language={'html'}
              showLineNumbers={false}
              theme={github}
              codeBlock
            />
            <CopyBlock
              text={`<script src="https://test-999111.s3.amazonaws.com/main.e5c12671.js"></script>`}
              language={'html'}
              showLineNumbers={false}
              theme={github}
              codeBlock
            />

            <Text>
              2. Then put this snippet code to the page you want to show the
              widget.
            </Text>
            {genreItem && (
              <CopyBlock
                text={` <div id="crooklynclan-widget" data-genre="${genreItem?.genre._id}" class="crooklynclan-widget"></div>`}
                language={'html'}
                showLineNumbers={false}
                theme={github}
                codeBlock
              />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
