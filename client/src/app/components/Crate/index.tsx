import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useGenres } from 'app/hooks/genres/useGenres';
import { useModalCrate } from 'app/hooks/ModalCrate/useModalCrate';
import { useSections } from 'app/hooks/sections/useSections';
import { useTags } from 'app/hooks/tags/useTags';
import { useTracksKeys } from 'app/hooks/trackKeys/useTrackKeys';
import { useItemCrate } from 'app/hooks/useItemCrate/useItemCrate';
import { selectSliceCrates } from 'app/pages/PageCrate/slice/selector';
import { useSelector } from 'react-redux';
import CreateCrateModal from './CreateCrateModal';
import ModalConfirmCrate from './ModalConfirmCrate';
import { useLocation } from 'react-router-dom';
import Edit from 'app/assets/images/crate/edit.png';
import Trash from 'app/assets/images/crate/trash.png';
import logoV4 from 'app/assets/images/logo/v4.png';

export default function Crate() {
  const { handleClickCrate } = useItemCrate();
  const { myTrackCrates, filterRules } = useSelector(selectSliceCrates);
  const {
    handleEditCrate,
    isModalOpen,
    setIsModalOpen,
    handleShowModalCreateCrate,
    yesModalDelete,
    modalDelete,
    isOpen,
    onCloseModalConfirmDeleteCrate,
  } = useModalCrate();
  const { pathname } = useLocation();
  const { sections = [] } = useSections();
  const { genres = [] } = useGenres();
  const { tags = [] } = useTags();
  const { contributors } = useCommunity();
  const { trackKeys = [] } = useTracksKeys();

  return (
    <Box>
      <Flex
        backgroundImage="linear-gradient(90deg, #000 4%, #fff0 50%)"
        gridGap="6px"
        alignItems="center"
        h="50px"
      >
        <Flex fontSize="16px" fontWeight={700} alignItems="center">
          <Image src={logoV4} alt="logo" h="40px" />

          <Text
            style={{ fontFamily: 'ArchivoBlack, sans-serif' }}
            color="#fff"
            fontWeight={700}
          >
            MY CRATES
          </Text>
        </Flex>
        <Box
          pr="1px"
          pb="1px"
          bg="#fff"
          color="#000"
          borderRadius="50%"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleShowModalCreateCrate()}
          cursor="pointer"
          w="20px"
          h="20px"
        >
          <span>+</span>
        </Box>
      </Flex>
      <Flex flexWrap="wrap" gridGap="6px" mt="5px">
        {myTrackCrates.map((quickLink, idx) => {
          return (
            <Flex
              key={idx}
              bg="#fff"
              p="2px 6px"
              pr={quickLink.role !== 'admin' ? '1px' : '6px'}
              gridGap="3px"
              alignItems="center"
              borderRadius="4px"
              border="1px solid #000"
            >
              <Box
                onClick={() => handleClickCrate(quickLink)}
                cursor="pointer"
                fontSize="10px"
                fontWeight={700}
                color={
                  pathname.includes('/tracks') &&
                  quickLink._id === filterRules._id
                    ? '#59ff00'
                    : '#000'
                }
                lineHeight="10px"
              >
                {quickLink?.name}
              </Box>
              {quickLink?.role !== 'admin' && (
                <Flex
                  onClick={() => {
                    handleEditCrate(quickLink);
                  }}
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                >
                  <Image w="18px" h="18px" src={Edit} />
                </Flex>
              )}
              {quickLink?.role !== 'admin' && (
                <Flex
                  onClick={() => {
                    modalDelete(quickLink._id);
                  }}
                  justifyContent="center"
                  alignItems="center"
                  color="#FFF"
                  cursor="pointer"
                >
                  <Image w="18px" h="18px" src={Trash} />
                </Flex>
              )}
            </Flex>
          );
        })}

        <CreateCrateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          genres={genres}
          contributors={contributors}
          labels={sections}
          tags={tags}
          trackKeys={trackKeys}
        />
      </Flex>
      <ModalConfirmCrate
        isOpen={isOpen}
        onClose={onCloseModalConfirmDeleteCrate}
        yesModalDelete={yesModalDelete}
      />
    </Box>
  );
}
