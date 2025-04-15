/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Center,
  Flex,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { BG_COLOR_TAG, COLOR_TAG } from 'app/constants';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { Track } from 'app/models';

import queryString from 'query-string';
import { memo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDate } from 'utils/date';

import IconYoutube from 'app/assets/images/common/image-youtube.png';
import { SORT_TYPE } from 'app/constants/enum';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useTracks } from 'app/hooks/tracks/useTracks';
import ShareTrack from '../ShareTrack';
import TrackAvatar from '../TrackAvatar';
import TrackInformation from '../TrackItem/Information';
import styles from './banner.module.scss';
import CartButton from '../CartButton';
import Share from 'app/assets/images/tracks/share.svg';
import DownloadTrack from '../DownloadTrack';
import { IoMdHeartEmpty } from 'react-icons/io';
import { formatTitle } from 'app/utils/formatTitleTrack';

interface Props {
  track: Track;
  isTrackDetail?: boolean;
}

export const BannerTrackDetail = memo(
  ({ track, isTrackDetail = true }: Props) => {
    const {
      title,
      artist,
      _id,
      artwork,
      genre,
      subGenre,
      subGenre2,
      tags = [],
      samples = [],
      createdAt,
      publishDate,
      isOriginal,
      favoriteByMe,
      isMyTrack,
    } = track;

    const isAddedTrackToCart = !track?.boughtByMe && !track?.isMyTrack;

    const { isLightMode } = useModeTheme();

    const { handlePlayOrPause, setIsAudioPlay } = usePlayers();
    const { onHandleClickItemTagGenre, addRemoveFavoriteTrack } = useTracks();

    const {
      isOpen: isShowModalShareTrack,
      onClose: onCloseModalShareTrack,
      onOpen: onOpenModalShareTrack,
    } = useDisclosure();

    const { search } = useLocation();
    const query = queryString.parse(search);
    const setId = query.id;
    function htmlDecode(input: string) {
      var doc = new DOMParser().parseFromString(input, 'text/html');
      return doc.documentElement.textContent;
    }

    useEffect(() => {
      // Function to handle messages received from the Spotify iframe
      window.addEventListener('message', function (event) {
        if (event.origin === 'https://open.spotify.com') {
          const data = event.data;
          if (!data.payload?.isPaused && data.type !== 'ready') {
            setIsAudioPlay(false);
          }
        }
      });
    }, [setIsAudioPlay]);

    const { isLargerThan768, isLargerThan426 } = useMediaScreen();

    const handleAddRemoveFavoriteTrack = useCallback(
      (trackId: string) => {
        addRemoveFavoriteTrack(trackId);
      },
      [addRemoveFavoriteTrack],
    );

    const renderGenreOrTag = useCallback(
      (content, bgColor, color, heading) => {
        const listOptions = ([...content] || []).sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        return (
          <Wrap columns={[2, null, 3, 8]} spacing="5px">
            {listOptions.map(item => {
              return (
                item && (
                  <WrapItem key={item?._id}>
                    <Text
                      display="flex"
                      h="25px"
                      justifyContent="center"
                      alignItems="center"
                      className={styles.itemTags}
                      onClick={() =>
                        onHandleClickItemTagGenre(SORT_TYPE.SHOW_TAGS, item)
                      }
                    >
                      {item?.name.toLocaleUpperCase()}
                    </Text>
                  </WrapItem>
                )
              );
            })}
          </Wrap>
        );
      },
      [onHandleClickItemTagGenre],
    );

    const renderOriginals = useCallback(() => {
      return (
        samples.length > 0 &&
        !isOriginal && (
          <Box gridGap="2px" alignItems="center" p="5px">
            <Text fontSize="14px" m="20px 0 15px 0" fontWeight="600">
              Original Works In this composition:
            </Text>
            {samples?.length && (
              <>
                <Flex
                  flexDir="column"
                  display={isLargerThan768 ? 'flex' : 'block'}
                  flexWrap="wrap"
                  gridGap="10px"
                >
                  {samples?.map((sam, index) => {
                    const url = sam.originalTrackUrl;
                    const keyIframe = 'embed/';
                    const position = 25;
                    const iframeURL = [
                      url.slice(0, position),
                      keyIframe,
                      url.slice(position),
                    ].join('');

                    return (
                      <Box
                        w="100%"
                        maxW="500px"
                        maxH="100px"
                        minW="320px"
                        p="0 5px 0 5px"
                      >
                        {sam.source === 'youtube' ? (
                          <a
                            href={sam.originalTrackUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Flex
                              m="0px 0 10px 0"
                              p="10px"
                              alignItems="center"
                              gridGap="15px"
                              borderRadius="10px"
                              color=" #fff"
                              backgroundColor=" #535353"
                              border=" 1px solid #c7c7c7"
                              fontSize=" 14px"
                              fontWeight=" 700"
                            >
                              <Image
                                bgColor="#fff"
                                className={styles.imageYoutube}
                                src={IconYoutube}
                              />
                              <Text fontSize="14px" fontWeight={700}>
                                {htmlDecode(sam.track)}
                              </Text>
                            </Flex>
                          </a>
                        ) : sam.source === 'spotify' ? (
                          <iframe
                            title={sam._id}
                            src={iframeURL}
                            width="100%"
                            height="90px"
                          />
                        ) : (
                          <Box border="1px solid gray" padding="5px">
                            <Text fontSize="14px" fontWeight={500}>
                              {sam.track}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Flex>
              </>
            )}
          </Box>
        )
      );
    }, [isLargerThan768, samples]);

    const handleIdTag = useCallback(
      value => {
        const tags = track.tags.find(i => {
          return i._id === value;
        });
        return (
          <Box mb="20px" textAlign="center" margin=" auto" w="250px" pb="20px">
            <Text
              lineHeight="40px"
              fontWeight="700"
              fontSize="30px"
              color="#fff"
            >
              {tags?.name}
            </Text>
            <Text
              lineHeight="25px"
              fontWeight="300"
              fontSize="16px"
              color="#fff"
            >
              {tags?.description}
            </Text>
          </Box>
        );
      },
      [track.tags],
    );

    const handleNameTagOrGenre = useCallback(() => {
      if (query.type === 'genres') {
        return (
          <Box textAlign="center" m="auto" w="250px" pb="20px">
            <Text
              lineHeight="40px"
              fontWeight="700"
              fontSize="30px"
              color="#fff"
            >
              {genre.name}
            </Text>
            <Text
              lineHeight="25px"
              fontWeight="300"
              fontSize="16px"
              color="#fff"
            >
              {genre.description}
            </Text>
          </Box>
        );
      } else {
        return handleIdTag(setId);
      }
    }, [genre, handleIdTag, query.type, setId]);

    const artistTextColor = useColorModeValue('#686868', '#dac0c0');

    const { isLargerThan500 } = useMediaScreen();

    const genres = [genre, subGenre, subGenre2]
      .filter(g => g?.name)
      .sort((a: any, b: any) => a?.name.localeCompare(b?.name));

    return (
      <Box
        bg={useColorModeValue('#ebebeb', 'rgb(43 52 70)')}
        p="10px"
        className={styles.container}
      >
        <Flex w="full" flexDir={isLargerThan426 ? 'row' : 'column'}>
          {isTrackDetail ? (
            <Box w="100%">
              <Flex w="100%" gridGap="10px" justifyContent="space-between">
                <TrackAvatar
                  widthIconPlay="67px"
                  widthAvatar="100px"
                  top="40%"
                  iconSize="40px"
                  avatar={artwork}
                  trackId={_id}
                  onClickPlayTrack={() => handlePlayOrPause(track)}
                />
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  w="calc(100% - 210px)"
                  gridGap="5px"
                  hidden={!isLargerThan500}
                >
                  <Box mr="auto">
                    <Text
                      className={styles.createdAt}
                      fontSize="10px"
                      color={isLightMode ? '#000' : '#fff'}
                      lineHeight="12px"
                      fontWeight="400"
                    >
                      {formatDate(publishDate || createdAt)}
                    </Text>
                    <Text
                      fontSize="12px"
                      fontWeight="600"
                      lineHeight="15px"
                      color={isLightMode ? '#000' : '#fff'}
                    >
                      {title}
                    </Text>
                    <Text
                      fontSize="12px"
                      textColor={artistTextColor}
                      fontWeight="600"
                      lineHeight="15px"
                    >
                      {artist}
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  w="100px"
                  alignItems="center"
                  justifyContent="end"
                  ml="auto"
                >
                  <Box margin="0px 30px">
                    <DownloadTrack track={track} />
                  </Box>
                  {isAddedTrackToCart && <CartButton track={track} />}
                  {!isMyTrack && (
                    <Tooltip
                      hasArrow
                      label={
                        favoriteByMe ? 'remove to favorite' : 'add to favorite'
                      }
                      bg="gray.300"
                      color="black"
                    >
                      <Flex
                        alignItems="center"
                        w="22px"
                        justifyContent={'center'}
                        cursor={'pointer'}
                        onClick={() => handleAddRemoveFavoriteTrack(track._id)}
                      >
                        {!favoriteByMe ? (
                          <IoMdHeartEmpty size={22} />
                        ) : (
                          <Center w="22px" fontSize={18}>
                            ❤️
                          </Center>
                        )}
                      </Flex>
                    </Tooltip>
                  )}

                  <Box>
                    <Tooltip hasArrow label="share" bg="gray.300" color="black">
                      <IconButton
                        onClick={onOpenModalShareTrack}
                        className={styles.iconButton}
                        aria-label="close"
                        icon={
                          <Image
                            filter={isLightMode ? 'unset' : 'invert(1)'}
                            w="20px"
                            h="20px"
                            src={Share}
                          />
                        }
                      />
                    </Tooltip>
                  </Box>
                </Flex>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                gridGap="5px"
                hidden={isLargerThan500}
                mt="10px"
              >
                <Box mr="auto">
                  <Text
                    className={styles.createdAt}
                    fontSize="10px"
                    color={isLightMode ? '#000' : '#fff'}
                    lineHeight="12px"
                    fontWeight="400"
                  >
                    {formatDate(publishDate || createdAt)}
                  </Text>
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="15px"
                    color={isLightMode ? '#000' : '#fff'}
                  >
                    {formatTitle(title)}
                  </Text>
                  <Text
                    fontSize="12px"
                    textColor={artistTextColor}
                    fontWeight="600"
                    lineHeight="15px"
                  >
                    {formatTitle(artist)}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ) : (
            handleNameTagOrGenre()
          )}
        </Flex>
        <Box mt="12px">
          <Flex gridGap="10px" alignItems="center" p="10px" flexWrap="wrap">
            <TrackInformation track={track} />
          </Flex>
          <Flex
            gridGap="10px"
            alignItems="center"
            p="0px 10px 10px 10px"
            flexWrap="wrap"
          >
            <Flex gridGap="10px" alignItems="center" flexWrap="wrap">
              {genres.map(g => (
                <Text
                  key={g?.name}
                  display="flex"
                  alignItems="center"
                  h="25px"
                  p="10px 15px"
                  fontWeight="600"
                  bg="#294f79"
                  borderRadius="5px"
                  textColor="#ffffff"
                  cursor="pointer"
                  fontSize="12px"
                  onClick={() =>
                    onHandleClickItemTagGenre(SORT_TYPE.SHOW_GENRES, g)
                  }
                >
                  {g?.name.toLocaleUpperCase()}
                </Text>
              ))}
            </Flex>
            {tags && (
              <Box>
                {renderGenreOrTag(tags, BG_COLOR_TAG, COLOR_TAG, 'tags')}
              </Box>
            )}
          </Flex>
        </Box>
        {renderOriginals()}
        <ShareTrack
          slug={track?.slug}
          isOpen={isShowModalShareTrack}
          onClose={onCloseModalShareTrack}
        />
      </Box>
    );
  },
);
