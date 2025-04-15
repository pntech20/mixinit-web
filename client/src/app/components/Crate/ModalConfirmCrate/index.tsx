import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

export default function ModalConfirmCrate({
  isOpen,
  onClose,
  yesModalDelete,
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>Are you sure you want to delete this crate?</Box>
        </ModalBody>

        <ModalFooter>
          <Button bg="#EDF2F7" color="#1A202C" mr={3} onClick={onClose}>
            No
          </Button>
          <Button
            backgroundColor="black"
            color="white"
            onClick={yesModalDelete}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
