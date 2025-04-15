import {
  Box,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useItemCrate } from 'app/hooks/useItemCrate/useItemCrate';
import { selectSliceCrates } from 'app/pages/PageCrate/slice/selector';
import { AiTwotoneDelete } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import './styles.scss';
import ModalConfirmCrate from 'app/components/Crate/ModalConfirmCrate';
const ItemCrate = () => {
  const { filterRules } = useSelector(selectSliceCrates);

  const { colorMode } = useColorMode();
  const { isDarkMode } = useModeTheme();
  const {
    handleClickCrate,
    modalDelete,
    yesModalDelete,
    onClose,
    isOpen,
    myTrackCrates,
  } = useItemCrate();

  const colorBorder = useColorModeValue(
    'rgba(0, 0, 0, 0.1)',
    'var(--chakra-colors-gray-600)',
  );
  const colorText = useColorModeValue('#000', '#fff');

  return (
    <Box className="crate-sort">
      <Box className={`button-my-crates`}>
        {myTrackCrates.length > 0 ? (
          myTrackCrates.map((item, index) => (
            <Box position="relative" key={index}>
              <Box>
                <Flex
                  _hover={{
                    backgroundColor: isDarkMode ? '#626b7d' : '#d2dce6',
                  }}
                  key={index}
                  className={`my-crate ${item._id} ${
                    filterRules.name === item.name
                      ? `active-crate-name-${colorMode}`
                      : `active-crate-${colorMode}`
                  } `}
                  onClick={() => handleClickCrate(item)}
                  border={`1px solid ${colorBorder}`}
                  cursor="pointer"
                >
                  <Box>
                    <Text color={colorText} textAlign="center">
                      {item.name}
                    </Text>
                  </Box>
                  <Flex className="icon-button">
                    <Box
                      onClick={e => {
                        e.stopPropagation();
                        modalDelete(item._id);
                      }}
                      className="delete"
                      marginLeft="10px"
                    >
                      <AiTwotoneDelete color="red" />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
              {/* {filterRules.name === item.name && (
                <Box
                  onClick={() => handleOnclear()}
                  _hover={{ cursor: 'pointer' }}
                  w="15px"
                  h="15px"
                  bg="red"
                  position="absolute"
                  right="40px"
                  top="13px"
                  borderRadius="50%"
                  color="white"
                  fontSize="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  opacity="0.8"
                >
                  X
                </Box>
              )} */}
            </Box>
          ))
        ) : (
          <Empty color={colorMode ? '#000' : 'unset'} />
        )}
      </Box>
      <ModalConfirmCrate
        isOpen={isOpen}
        onClose={onClose}
        yesModalDelete={yesModalDelete}
      />
      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>Are you sure you want to delete this crate?</Box>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
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
      </Modal> */}
    </Box>
  );
};

export default ItemCrate;
