import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useClaimSample } from 'app/hooks/uploader/useClaimSample';
import ListSamples from 'app/utils/ListSample';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './claimSample.module.scss';

export default function ClaimSample({
  passDataOfClaimSample,
  setIsOriginal,
  isOriginal,
  data,
  listClaimSamples,
  setListClaimSamples,
}: any) {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFinished, setIsFinished] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const { t } = useTranslation();
  const {
    spotifyTracks,
    valueTrackSearchSpotify,

    setQuery,
    setValueTrackSearchSpotify,
    handleKeyPressSpotify,

    handleSelectItemSpotify,
    setValueTrackSpotify,
    isShowResultSpotify,
    setShowResultSpotify,
    setShowResultYtb,
  } = useClaimSample(setListClaimSamples);

  const handleAddManually = () => {
    setTitle('');
    setArtist('');
    const track = `${title} - ${artist}`;

    setListClaimSamples(pre => [
      ...pre,
      {
        _id: new Date().getTime(),
        source: 'manually',
        track,
        originalTrackUrl: '',
        title,
        artists: artist,
      },
    ]);
  };

  const removeSample = useCallback(
    sampleId => {
      const result = listClaimSamples.filter(sample => sample._id !== sampleId);
      setListClaimSamples(result);
    },
    [listClaimSamples, setListClaimSamples],
  );

  useEffect(() => {
    if (data) {
      setListClaimSamples(data);
    }
  }, [data, setListClaimSamples]);

  useEffect(() => {
    let isRequire = true;
    if (listClaimSamples.length) {
      isRequire = false;
    }
    isFinished && passDataOfClaimSample(isRequire ? null : listClaimSamples);
  }, [listClaimSamples, passDataOfClaimSample, isFinished]);

  const handleFinished = () => {
    onClose();
    setQuery('');
    setValueTrackSearchSpotify('');
    setShowResultSpotify(false);
    setShowResultYtb(false);
    setIsFinished(true);
  };

  const colorBorder = useColorModeValue('black', 'white');

  return (
    <Box className={styles.claimSimples}>
      <Box className={styles.borderSolid} />
      <Box fontWeight="800" fontSize="16px" mb="10px" className="trackMetadata">
        Samples:
      </Box>
      <Text fontSize="14px" fontWeight="500">
        {t('uploader.claimAll')}
      </Text>
      <Flex mt="15px" mb="10px" ml="0px" alignItems="center" gridGap={3}>
        {!isOriginal && (
          <button
            style={{
              padding: '5px 10px',
              color: 'white',
              background: '#1a202c',
              fontSize: '14px',
              marginRight: '10px',
              border: `1px solid ${colorBorder}`,
            }}
            onClick={onOpen}
          >
            CLAIM SAMPLES
          </button>
        )}
        <Flex>
          <Checkbox
            onChange={e => setIsOriginal(e.target.checked)}
            isChecked={isOriginal}
          />
          <Text fontWeight="600" ml="10px">
            Track Is Original
          </Text>
        </Flex>
      </Flex>

      <Modal
        size={'25xl'}
        isOpen={isOpen}
        onClose={handleFinished}
        onOverlayClick={handleFinished}
      >
        <ModalOverlay />
        <ModalContent w={{ base: '90%', xl: '80%' }}>
          <ModalHeader>Claim Samples</ModalHeader>
          <ModalCloseButton bg="white" color="black" />
          <ModalBody>
            <Flex className={styles.ctnLabel} gridGap="10px" flexWrap="wrap">
              {/* {renderLabels(listClaimSamples)} */}
              <ListSamples
                listClaimSamples={listClaimSamples}
                removeSample={removeSample}
                setListClaimSamples={setListClaimSamples}
              />
            </Flex>
            <Flex
              marginTop="17px"
              gridGap="25px"
              display={{ base: 'block', md: 'block', lg: 'flex' }}
            >
              <Box w={{ base: '100%', md: '100%', lg: '40%' }} maxWidth="100%">
                <Text fontWeight={900} mb="24px">
                  Add Sample using Spotify (recommended)
                </Text>
                <Input
                  type="text"
                  mt="10px"
                  placeholder="Start typing artist or title then select from the options..."
                  _placeholder={{ color: '#d4d4d4' }}
                  onChange={e => {
                    setValueTrackSearchSpotify(e.target.value);
                    setValueTrackSpotify(null);
                  }}
                  value={valueTrackSearchSpotify}
                  onKeyPress={handleKeyPressSpotify}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                {spotifyTracks.length !== 0 && isShowResultSpotify && (
                  <Box className={styles.resultSpotify}>
                    <Flex
                      justifyContent="flex-end"
                      m="10px"
                      cursor="pointer"
                      className={styles.closeResult}
                    >
                      <CloseIcon onClick={() => setShowResultSpotify(false)} />
                    </Flex>
                    <Box>
                      {spotifyTracks.map(item => (
                        <p
                          className="ml-2"
                          key={item?._id}
                          onClick={() => {
                            handleSelectItemSpotify(item);
                          }}
                        >
                          {item?.name}{' '}
                          {item?.artists?.length
                            ? `- ${item?.artists
                                ?.map(art => art?.name)
                                ?.join(', ')}`
                            : ''}
                        </p>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              <Box
                w={{ base: '100%', md: '100%', lg: '60%' }}
                mt={{ base: '20px', md: '20px', lg: 'unset' }}
                maxWidth="100%"
              >
                <Text fontWeight={900}>
                  Add Sample Manually (enter the title and artist only if you
                  cannot find the sample on Soptify, then click "Add")
                </Text>
                <Flex gridGap="8px">
                  <Input
                    type="text"
                    mt="10px"
                    placeholder="Title"
                    _placeholder={{ color: '#d4d4d4' }}
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value);
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <Input
                    type="text"
                    mt="10px"
                    placeholder="Artist"
                    _placeholder={{ color: '#d4d4d4' }}
                    value={artist}
                    onChange={e => {
                      setArtist(e.target.value);
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <Button
                    colorScheme="blue"
                    mt="10px"
                    width="200px"
                    fontSize="14px"
                    disabled={!title || !artist}
                    onClick={handleAddManually}
                  >
                    Add sample
                  </Button>
                </Flex>
                {/* <Input
                  type="text"
                  mt="10px"
                  value={query}
                  placeholder="Search original tracks on Youtube"
                  _placeholder={{ color: '#d4d4d4' }}
                  onChange={e => {
                    setQuery(e.target.value);
                    setValueTrackSearchYtb(null);
                  }}
                  onKeyPress={handleKeyPressYtb}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />

                <Box
                  className={classnames(styles.resultSpotify, styles.resultYtb)}
                  display={listResultYtb ? 'block' : 'none'}
                  overflow={isShowResultYtb ? 'scroll' : 'unset !important'}
                  overflowX="hidden"
                >
                  <ul
                    className={classnames(styles.items, {
                      [styles.itemsEmpty]: !isShowResultYtb,
                    })}
                  >
                    {isLoadingYtb ? (
                      <Box textAlign="center">
                        <Spinner />
                      </Box>
                    ) : listResultYtb?.length > 0 ? (
                      isShowResultYtb && (
                        <Box>
                          <Flex
                            justifyContent="flex-end"
                            cursor="pointer"
                            className={styles.closeResult}
                            onClick={() => setShowResultYtb(false)}
                          >
                            <CloseIcon />
                          </Flex>
                          {listResultYtb.map((item: any, index: number) => (
                            <li
                              className={styles.item}
                              key={index}
                              onClick={() => handleSelectItemYtb(item)}
                            >
                              <Box color="#000">
                                <b>{item.title}</b>
                                <p>{item.description}</p>
                              </Box>
                              <ul className={styles.meta}>
                                <li>Channel Title: {item.channelTitle}</li>
                                <li>
                                  Uploaded: {formatDate(item.publishTime)}
                                </li>
                              </ul>
                              <img alt="" src={item?.thumbnails?.medium?.url} />
                            </li>
                          ))}
                        </Box>
                      )
                    ) : (
                      <Text textAlign="center">No results</Text>
                    )}
                  </ul>
                </Box> */}
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleFinished}
              mt="50px"
              mb="30px"
            >
              Finished
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
