import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import PlaceholderBgDefault from 'app/assets/placeholders/track-placeholder.svg';

import Share from 'app/assets/images/tracks/share.svg';
import IconAdd from 'app/assets/svgs/IconAdd';
import { BG_COLOR_TAG, COLOR_TAG } from 'app/constants';
import {
  Role,
  SORT_TYPE,
  TRACK_DETAIL_TABS,
  TRACK_TYPE,
} from 'app/constants/enum';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMyRelease } from 'app/hooks/myMedia/useMyRelease';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { Track } from 'app/models';
import { formatDate } from 'app/utils/date';
import { default as classNames } from 'classnames';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
// import { FaEdit } from 'react-icons/fa';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';
import { MdDelete, MdOutlineRemove } from 'react-icons/md';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { formatTime } from 'utils/formatTime';
import CartButton from '../CartButton';
import DownloadTrack from '../DownloadTrack';
import styles from './index.module.scss';
import { FaEdit, FaPause, FaPlay } from 'react-icons/fa';
import { NumberIndex } from 'utils/numberIndex';
import { useSelector } from 'react-redux';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import ShareTrack from '../ShareTrack';
import { IoMdHeartEmpty } from 'react-icons/io';
import { formatTitle } from 'app/utils/formatTitleTrack';

interface TrackItemProps {
  index?: number;
  track: Track;
  refEye?: any;
  trackIsReleaseDetail?: boolean;
  trackIsPlaylistDetail?: boolean;
  sort?: string;
  onClick?: (value) => void;
  idLabel?: string;
  isMyTracks?: boolean;
  isShowAllTracks?: boolean;
  tabActive?: boolean;
  isMyLibraryPage?: boolean;
  isRelatedTracks?: boolean;
  updateWishlistStatus?: any;
  handleOpenBuyTrackBySub?: any;
  handleOpenBuyTrack?: any;
  isChartsPage?: any;
  onHandleClickItemTagGenre?: any;
}

const TrackItem = forwardRef((props: TrackItemProps) => {
  const {
    track,
    index = 1,
    refEye,
    sort = '',
    onClick,
    idLabel,
    isMyTracks = false,
    isShowAllTracks = false,
    isMyLibraryPage = false,
    isRelatedTracks = false,
    updateWishlistStatus,
    handleOpenBuyTrackBySub,
    handleOpenBuyTrack,
    isChartsPage = false,
    onHandleClickItemTagGenre,
  } = props;
  const {
    isOpen: isShowModalShareTrack,
    onOpen: onOpenModalShareTrack,
    onClose: onCloseModalShareTrack,
  } = useDisclosure();
  const history = useHistory();
  const { t } = useTranslation();
  const { isOpen, onClose: onCloseDelete } = useDisclosure();
  const {
    playingTrack,
    handlePlayOrPause,
    waveSurfer,
    handlePlayPause,
    isPlaying: isPlayingTrack,
    isAudioPlay,
  } = usePlayers();
  const cancelRef = useRef<any>(null);
  const {
    onDeleteTrack,
    handleHideAndHiddenMyTrack,
    isHideAndHiddenMyTrack,
    isShowModalConfirmHideTrack,
    onOpenModalConfirmHideTrack,
    onCloseModalConfirmHideTrack,
    addRemoveFavoriteTrack,
  } = useTracks();
  const { currentPage, resultsPerPage } = useSelector(selectSliceTracks);

  const { listFiles } = useMyRelease('');
  const { pathname } = useLocation();
  const { isDarkMode, isLightMode } = useModeTheme();

  const isMyMediaPage = pathname.includes('my-media');
  const isHomePage = pathname.includes('home');
  const isChartPage = pathname.includes('charts');

  const isAddedTrackToCart = !track?.boughtByMe && !track?.isMyTrack;

  const [isExpand, setExpand] = useState(false);

  useEffect(() => {
    if (isShowAllTracks) {
      onHandleToggleOpen();
    } else {
      onHandleToggleClose();
    }
  }, [isShowAllTracks]);

  // const isSortYear = useMemo(() => {
  //   return sort.includes('year');
  // }, [sort]);

  // const isSortTime = useMemo(() => {
  //   return sort.includes('duration');
  // }, [sort]);

  const onHandleToggleOpen = () => {
    setExpand(true);
  };

  const onHandleToggleClose = () => {
    setExpand(false);
  };

  useImperativeHandle(refEye, () => ({
    onHandleToggleOpen,
    onHandleToggleClose,
  }));

  const handleLinkClick = e => {
    e.preventDefault();
    const url = `/tracks/${slug}?tab=${TRACK_DETAIL_TABS.RELEASE}`;
    window.open(url, '_blank');
  };

  const {
    title,
    artist,
    artwork,
    user,
    label,
    genre,
    subGenre,
    subGenre2,
    bpmStart,
    bpmEnd,
    tags = [],
    _id,
    createdAt,
    publishDate,
    trackKey: { camelotKey, musicKey },
    year,
    duration,
    isClean,
    type,
    samples = [],
    slug,
    disabledByUser,
    totalBuys,
  } = track;
  const [favoritedBy, setFavoritedBy] = useState(
    track?.favoritedBy?.length > 0 ? track?.favoritedBy?.length : 0,
  );
  const handleUpdateFavoriteBy = (favoritedByMe: Boolean) => {
    if (!favoritedByMe) {
      setFavoritedBy(favoritedBy - 1);
    } else {
      setFavoritedBy(favoritedBy + 1);
    }
  };
  const handleAddRemoveFavoriteTrack = useCallback(
    (trackId: string) => {
      addRemoveFavoriteTrack(trackId);
    },
    [addRemoveFavoriteTrack],
  );

  const existedTrack = useCallback(
    field => {
      const ischeck = listFiles?.some(item => item._id === field._id);
      if (!ischeck) {
        return (
          <Tooltip shouldWrapChildren hasArrow label={t('track.addTrack')}>
            <IconAdd onClick={onClick} cursor="pointer" />
          </Tooltip>
        );
      }
      if (ischeck) {
        return (
          <Tooltip shouldWrapChildren hasArrow label={t('track.removeTrack')}>
            <Flex className={styles.iconRemove}>
              <MdOutlineRemove height="100%" width="100%" onClick={onClick} />
            </Flex>
          </Tooltip>
        );
      }
      return <Box></Box>;
    },
    [listFiles, onClick, t],
  );

  const bpmEndShow = bpmStart === bpmEnd ? '' : ` - ${bpmEnd}`;

  const renderSortSelected = useCallback(() => {
    let sortSelected = '';
    let label = '';
    const isSortCamelotKey = sort.includes('camelotKey');
    if (isSortCamelotKey) {
      sortSelected = camelotKey;
      label = 'Camelot Key';
    }
    const isSortMusicKey = sort.includes('musicKey');
    if (isSortMusicKey) {
      sortSelected = musicKey;
      label = 'Music Key';
    }
    const isBpmStart = sort.includes('bpmStart');
    if (isBpmStart) {
      sortSelected = `${bpmStart} ${bpmEndShow}`;
      label = 'Bpm';
    }
    const isSortYear = sort.includes('year');
    if (isSortYear) {
      sortSelected = `${year}`;
      label = 'Year';
    }
    return (
      sortSelected && (
        <Flex
          alignItems="center"
          borderRadius="5px"
          p="2px 5px"
          bg={isDarkMode ? 'unset' : '#000'}
        >
          <Text
            textColor={isDarkMode ? '#ea3636' : '#fff'}
            fontSize="12px"
            fontWeight="500"
          >
            {label}:
          </Text>
          <Text
            fontWeight="500"
            textColor={isDarkMode ? '#ffffff' : '#fff'}
            fontSize="12px"
            p="0 5px"
          >
            {sortSelected}
          </Text>
        </Flex>
      )
    );
  }, [bpmEndShow, bpmStart, camelotKey, isDarkMode, musicKey, sort, year]);

  const renderGenreOrTag = useCallback(
    (content, bgColor, color, heading) => {
      const listOptions = ([...content] || []).sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      return (
        <Wrap columns={[2, null, 3, 8]} spacing="5px">
          {listOptions.map(item => {
            // const style = colorTagGenre(item, bgColor, color);

            return (
              item && (
                <WrapItem key={item?._id}>
                  <Text
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.itemTags}
                    // style={style}
                    onClick={() =>
                      onHandleClickItemTagGenre(SORT_TYPE.SHOW_TAGS, item)
                    }
                  >
                    {item?.name}
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

  const genres = [genre, subGenre, subGenre2]
    .filter(g => g?.name)
    .sort((a: any, b: any) => a?.name.localeCompare(b?.name));

  const renderActionForMyMedia = () => {
    return (
      isMyMediaPage && (
        <Flex ml="12px" gridGap="5px" alignItems="center">
          <Tooltip
            hasArrow
            label={'All time Sales'}
            bg="gray.300"
            color="black"
          >
            <Text cursor={'pointer'} fontWeight={600}>
              {totalBuys}
            </Text>
          </Tooltip>

          <Text
            onClick={onOpenModalConfirmHideTrack}
            fontSize={{ base: '13px', md: '14px' }}
            cursor={'pointer'}
            fontWeight={600}
          >
            {!disabledByUser && <MdDelete cursor="pointer" fontSize="20px" />}
          </Text>
          <FaEdit
            cursor="pointer"
            onClick={() => {
              history.push({
                pathname: '/uploader',
                state: { track },
              });
            }}
            fontSize="20px"
          />
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCloseDelete}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Track
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete this track?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    bg="#EDF2F7"
                    color="#1A202C"
                    ref={cancelRef}
                    onClick={onCloseDelete}
                  >
                    Cancel
                  </Button>
                  <Button
                    backgroundColor="red"
                    onClick={() => onDeleteTrack(track?._id)}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Flex>
      )
    );
  };

  const isPlaying = useMemo(() => {
    return playingTrack?._id === _id;
  }, [playingTrack, _id]);

  return (
    <>
      <Box
        position="relative"
        backgroundColor={
          index % 2 !== 0
            ? 'hsla(204.07185628742513, 69.87%, 53.14%, 0.18)'
            : isDarkMode
            ? '#5a5a5a'
            : '#f7f7f7'
        }
        id={`track_${_id}`}
        className={styles.containerTrackItem}
      >
        {isPlaying && <Box className={styles.containerProgress} id={_id} />}
        <Box
          className={classNames(
            styles.containerTotal,
            isPlaying && styles.playingBorder,
          )}
        >
          <Flex
            className={styles.containerTrackItem}
            padding="5px"
            position="relative"
            justifyContent="space-between"
            alignItems="center"
            display={{ base: 'block', md: 'flex' }}
          >
            <Flex alignItems="center">
              <Text
                width={{ base: '32px', md: '55px' }}
                className={styles.numberIndex}
                mr={{ md: '5px' }}
              >
                {NumberIndex(
                  index,
                  isHomePage ||
                    isMyLibraryPage ||
                    isRelatedTracks ||
                    isChartPage
                    ? 1
                    : currentPage,
                  isHomePage ||
                    isMyLibraryPage ||
                    isRelatedTracks ||
                    isChartPage
                    ? 20
                    : resultsPerPage,
                )}
                .
              </Text>
              <Box
                mr="5px"
                padding="9px"
                bg="#000"
                borderRadius="50%"
                cursor="pointer"
                onClick={() => {
                  if (isPlaying && isPlayingTrack) {
                    handlePlayPause(playingTrack);
                  } else {
                    if (isPlaying && isAudioPlay) {
                      handlePlayPause(playingTrack);
                    } else {
                      handlePlayOrPause(track);
                    }
                  }
                }}
              >
                {isPlaying && isPlayingTrack ? (
                  <FaPause size="15px" color="rgba(255, 255, 255, 0.9)" />
                ) : (
                  <FaPlay size="15px" color="rgba(255, 255, 255, 0.9)" />
                )}
              </Box>
              <Image
                borderRadius="4px"
                w="40px"
                h="40px"
                fallbacksrc={PlaceholderBgDefault}
                src={artwork}
                alt="track"
              />

              <Box ml="10px">
                <Flex gridGap="5px" alignItems="center">
                  {isClean !== null && (
                    <Box
                      className={styles.isClean}
                      backgroundColor={isClean ? '#1bd32e' : '#e41111'}
                    />
                  )}
                  {isClean === null && (
                    <Flex gridGap="5px">
                      <Box
                        className={styles.isClean}
                        backgroundColor={'#e41111'}
                      />
                      <Box
                        className={styles.isClean}
                        backgroundColor={'#1bd32e'}
                      />
                    </Flex>
                  )}
                  <Text className={styles.createdTrack}>
                    {formatDate(publishDate || createdAt)}
                  </Text>
                  <Box>
                    <Text
                      color={type === TRACK_TYPE.AUDIO ? '#fff' : '#000'}
                      backgroundColor={
                        type === TRACK_TYPE.AUDIO ? '#002fff' : '#ffbf00'
                      }
                      fontSize="10px"
                      fontWeight="bold"
                      padding="0px 1px"
                    >
                      {type}
                    </Text>
                  </Box>
                  <Flex
                    alignItems="center"
                    borderRadius="5px "
                    border="1px solid  #979797"
                    bg={isDarkMode ? 'unset' : '#e2e2e2'}
                  >
                    <Text
                      fontWeight={600}
                      textColor={isDarkMode ? '#ffffff' : '#000'}
                      fontSize="10px"
                      p="0 2px"
                    >
                      {bpmStart}
                      {bpmEndShow}
                    </Text>
                    <Text
                      textColor={isDarkMode ? '#ea3636' : '#000'}
                      fontSize="10px"
                      fontWeight={600}
                      p="0 2px"
                    >
                      bpm
                    </Text>
                  </Flex>
                </Flex>

                <Text
                  onClick={() => {
                    history.push({
                      pathname: `/tracks/${slug}`,
                      state: { isShowShareTrack: false },
                    });
                  }}
                  className={styles.titleTrack}
                  fontSize={{ base: '13px', md: '14px' }}
                  w={{ base: '220px', md: '100%' }}
                >
                  {formatTitle(title)}
                </Text>
                <Text
                  className={styles.artistTrack}
                  color="#686868"
                  fontSize={{ base: '12px', md: '13px' }}
                  _dark={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {formatTitle(artist)}
                </Text>
              </Box>
            </Flex>
            <Flex
              width={{ md: '250px', base: 'unset' }}
              alignItems="center"
              justifyContent="flex-end"
            >
              {renderSortSelected()}
              <Box mr="5px">
                {idLabel &&
                  isMyTracks &&
                  !disabledByUser &&
                  existedTrack(track)}
              </Box>
              <DownloadTrack
                track={track}
                handleOpenBuyTrackBySub={handleOpenBuyTrackBySub}
              />

              {!isMyMediaPage && !isMyLibraryPage && (
                <Flex alignItems="center">
                  {isAddedTrackToCart && (
                    <CartButton
                      track={track}
                      isChartsPage={isChartsPage}
                      updateWishlistStatus={updateWishlistStatus}
                      handleOpenBuyTrack={handleOpenBuyTrack}
                    />
                  )}
                </Flex>
              )}

              {renderActionForMyMedia()}

              {!isMyMediaPage && !isMyLibraryPage && (
                <>
                  <Tooltip
                    hasArrow
                    label={
                      track?.favoriteByMe
                        ? 'remove to favorite'
                        : 'add to favorite'
                    }
                    bg="gray.300"
                    color="black"
                  >
                    <Flex
                      alignItems="center"
                      w="22px"
                      justifyContent={'center'}
                      cursor={'pointer'}
                      onClick={() => {
                        handleAddRemoveFavoriteTrack(track._id);
                        handleUpdateFavoriteBy(!track?.favoriteByMe);
                      }}
                    >
                      {!track?.favoriteByMe ? (
                        <IoMdHeartEmpty size={22} />
                      ) : (
                        <Box fontSize={18}>❤️</Box>
                      )}
                    </Flex>
                  </Tooltip>
                  {favoritedBy > 0 && (
                    <Tooltip
                      hasArrow
                      label={'Number of likes'}
                      bg="gray.300"
                      color="black"
                    >
                      <Text cursor={'pointer'} fontWeight={600}>
                        {favoritedBy}
                      </Text>
                    </Tooltip>
                  )}
                </>
              )}

              <Tooltip
                hasArrow
                label={!isExpand ? 'view more' : 'view less'}
                bg="gray.300"
                color="black"
              >
                <Box
                  cursor="pointer"
                  onClick={isExpand ? onHandleToggleClose : onHandleToggleOpen}
                  ref={refEye}
                  ml="4px"
                >
                  {isExpand ? (
                    <BsFillEyeSlashFill fontSize="20px" />
                  ) : (
                    <IoEyeSharp fontSize="20px" />
                  )}
                </Box>
              </Tooltip>
            </Flex>
          </Flex>

          {isExpand && (
            <Box position="relative">
              <Divider
                margin="6px 0px 12px 0px"
                width="unset"
                opacity="unset"
              />

              <Flex gridGap="10px" alignItems="center" p="10px" flexWrap="wrap">
                <Flex
                  alignItems="center"
                  borderRadius="5px"
                  p="2px 5px"
                  bg={isDarkMode ? 'unset' : '#000'}
                  cursor={user?.role !== Role.ADMIN ? 'pointer' : 'unset'}
                  onClick={() => {
                    if (user?.role !== Role.ADMIN) {
                      history.push(`/contributors/${user?.slug}`);
                    }
                  }}
                >
                  <Image
                    src={user?.avatar}
                    w="12px"
                    h="12px"
                    borderRadius="50px"
                    alt="avatar"
                  />
                  <Text
                    fontWeight="500"
                    textColor="#fff"
                    fontSize="12px"
                    p="0 5px"
                  >
                    {user?.username}
                  </Text>
                </Flex>
                <Link to={`/labels/${label?.slug}?tab=1`}>
                  <Flex
                    alignItems="center"
                    borderRadius="5px"
                    p="2px 5px"
                    bg={isDarkMode ? 'unset' : '#000'}
                  >
                    <Image
                      src={label?.squareImageUrl}
                      w="12px"
                      h="12px"
                      borderRadius="50px"
                      alt="avatar"
                    />
                    <Text
                      fontWeight="500"
                      textColor="#fff"
                      fontSize="12px"
                      p="0 5px"
                    >
                      {label?.name}
                    </Text>
                  </Flex>
                </Link>
                <Flex
                  alignItems="center"
                  borderRadius="5px"
                  p="2px 5px"
                  bg={isDarkMode ? 'unset' : '#000'}
                >
                  <Text
                    textColor={isDarkMode ? '#ea3636' : '#fff'}
                    fontSize="12px"
                    fontWeight="500"
                  >
                    BPM:
                  </Text>
                  <Text
                    fontWeight="500"
                    textColor={isDarkMode ? '#ffffff' : '#fff'}
                    fontSize="12px"
                    p="0 5px"
                  >
                    {bpmStart}
                    {bpmEndShow}
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  borderRadius="5px"
                  p="2px 5px"
                  bg={isDarkMode ? 'unset' : '#000'}
                >
                  <Text
                    textColor={isDarkMode ? '#ea3636' : '#fff'}
                    fontSize="12px"
                    fontWeight="500"
                  >
                    CAMELOT KEY:
                  </Text>
                  <Text
                    fontWeight="500"
                    textColor={isDarkMode ? '#ffffff' : '#fff'}
                    fontSize="12px"
                    p="0 5px"
                  >
                    {camelotKey}
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  borderRadius="5px"
                  p="2px 5px"
                  bg={isDarkMode ? 'unset' : '#000'}
                >
                  <Text
                    textColor={isDarkMode ? '#ea3636' : '#fff'}
                    fontSize="12px"
                    fontWeight="500"
                  >
                    MUSIC KEY:
                  </Text>
                  <Text
                    fontWeight="500"
                    textColor={isDarkMode ? '#ffffff' : '#fff'}
                    fontSize="12px"
                    p="0 5px"
                  >
                    {musicKey}
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  borderRadius="5px"
                  p="2px 5px"
                  bg={isDarkMode ? 'unset' : '#000'}
                >
                  <Text
                    textColor={isDarkMode ? '#ea3636' : '#fff'}
                    fontSize="12px"
                    fontWeight="500"
                  >
                    LENGTH:
                  </Text>
                  <Text
                    fontWeight="500"
                    textColor={isDarkMode ? '#ffffff' : '#fff'}
                    fontSize="12px"
                    p="0 5px"
                  >
                    {formatTime(duration, true)}
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  borderRadius="5px"
                  p="2px 5px"
                  bg={isDarkMode ? 'unset' : '#000'}
                >
                  <Text
                    textColor={isDarkMode ? '#ea3636' : '#fff'}
                    fontSize="12px"
                    fontWeight="500"
                  >
                    YEAR:
                  </Text>
                  <Text
                    fontWeight="500"
                    textColor={isDarkMode ? '#ffffff' : '#fff'}
                    fontSize="12px"
                    p="0 5px"
                  >
                    {year}
                  </Text>
                </Flex>
              </Flex>
              <Flex gridGap="30px" alignItems="center" p="0px 10px 10px 10px">
                <Box>
                  <Text className={styles.genresTagsTrack}>GENRES:</Text>
                  <Flex gridGap="5px" alignItems="center" flexWrap="wrap">
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
                  </Flex>
                </Box>

                <Box>
                  <Text className={styles.genresTagsTrack}>TAGS:</Text>
                  {tags && (
                    <Box>
                      {renderGenreOrTag(tags, BG_COLOR_TAG, COLOR_TAG, 'tags')}
                    </Box>
                  )}
                </Box>
              </Flex>
              {samples?.length > 0 && (
                <Box marginLeft="10px" mt="10px">
                  <Text
                    textDecoration="underline"
                    fontSize="10px"
                    fontWeight={700}
                  >
                    ORIGINAL WORKS USED:
                  </Text>
                  {samples.map((sample, idx) => (
                    <Box key={idx} lineHeight="14px">
                      <a
                        href={sample?.originalTrackUrl || undefined}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '12px', lineHeight: '14px' }}
                      >
                        {sample?.track}
                      </a>
                    </Box>
                  ))}
                </Box>
              )}
              <Flex alignItems="center">
                <Text fontSize="12px" mt="5px" pl="10px" mr="auto">
                  You can get this track in
                  <chakra.span
                    href={`/tracks/${slug}?tab=${TRACK_DETAIL_TABS.RELEASE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    cursor="pointer"
                    color="#006EE4"
                    textDecorationLine="underline"
                    ml="4px"
                    sx={{
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={handleLinkClick}
                  >
                    THESE
                  </chakra.span>{' '}
                  multipacks.
                </Text>
                <Flex alignItems="center">
                  <Tooltip hasArrow label="share" bg="gray.300" color="black">
                    <IconButton
                      onClick={() => {
                        onOpenModalShareTrack();
                      }}
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
                </Flex>
              </Flex>
            </Box>
          )}
        </Box>
        {isPlaying && (
          <Box
            position="absolute"
            bottom="-12px"
            width="calc(100% + 20px)"
            right={0}
            className={
              isDarkMode ? styles.sliderPlayingDark : styles.sliderPlaying
            }
          >
            <input
              className={styles.slider}
              onChange={e => {
                waveSurfer.seekTo(Number(e.target.value) / 100);
              }}
              defaultValue="0"
              style={{ width: '100%', padding: '0px', border: '0px' }}
              type="range"
              step="0.1"
              id={`slider${_id}`}
              min="0"
              max="100"
            />
          </Box>
        )}
      </Box>
      <ShareTrack
        slug={track?.slug}
        isOpen={isShowModalShareTrack}
        onClose={onCloseModalShareTrack}
      />
      <Modal
        isOpen={isShowModalConfirmHideTrack}
        onClose={onCloseModalConfirmHideTrack}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>Are you sure you want to hide this track?</Box>
          </ModalBody>
          <ModalFooter>
            <Button
              bg="#EDF2F7"
              color="#1A202C"
              onClick={onCloseModalConfirmHideTrack}
            >
              Close
            </Button>
            <Button
              bg="#EDF2F7"
              color="#1A202C"
              onClick={() => handleHideAndHiddenMyTrack(track)}
              ml={3}
              isLoading={isHideAndHiddenMyTrack}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default TrackItem;
