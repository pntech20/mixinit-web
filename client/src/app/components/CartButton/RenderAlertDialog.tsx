import { useCallback, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { setLocalStorage } from 'app/helpers/local-storage';
import { toastWarning } from 'app/helpers/toast';

export default function RenderAlertDialog({
  onClick,
  isOpen,
  onClose,
  title,
  content,
  isShowCheckbox = false,
  name = '',
}) {
  const cancelRef = useRef<any>(null);

  const onChange = useCallback(
    e => {
      if (e.target.checked)
        toastWarning('You can reset all warnings in your account settings.');
      setLocalStorage(name, !e.target.checked);
    },
    [name],
  );

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>{content}</Text>
            {isShowCheckbox && (
              <Checkbox mt="10px" onChange={onChange}>
                <Text fontSize="14px">Don't Show Again</Text>
              </Checkbox>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button bg="#EDF2F7" color="#1A202C" onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="#EDF2F7"
              color="#1A202C"
              ref={cancelRef}
              onClick={onClick}
              ml={3}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
