import {
  Badge,
  Box,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Accordion,
  AccordionPanel,
  AccordionItem,
  AccordionButton,
} from '@chakra-ui/react';
import { HelmetPage } from 'app/components/HelmetPage';
import InputSearch from 'app/components/InputSearch';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Empty from 'app/components/Empty';
import TrackItem from 'app/components/TrackItem';
import TrackList from 'app/components/TrackList';
import {
  renderLoadingTracks,
  renderTrackListItem,
} from 'app/components/TrackUtils/track';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';
import styles from './styles.module.scss';
import { useMyLibrary } from 'app/hooks/myLibrary/useMyLibrary';
import { formatDate } from 'app/utils/date';
import { GrDocumentZip } from 'react-icons/gr';
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi';
import DropDown from 'app/components/Common/Dropdowns';
import { useFilters } from 'app/hooks/filters/userFilters';
import { MY_LIBRARY_TABS } from 'app/constants/enum';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

export function MyLibraryPage() {
  const { isDisputing } = useSelector(selectAuth);
  const history = useHistory();
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const { isLargerThan992 } = useMediaScreen();

  const ref = useRef<any>(null);

  const {
    myTracksPurchased = [],
    isLoadingTrackMyLibrary,
    searchValue,
    handleSearch,
    handleZip,
    isLoadingDownloadZip,
    isOpen,
    onOpen,
    onClose,
    myTracksStarPurchased = [],
    myAllTracksPurchased = [],
    isMyLibraryStar,
    isMyLibrarySubscription,
    myTracksSubscriptionPurchased = [],
    isMyLibraryCash,
    isMyLibraryAll,
    selectedTab,
    setSelectedTab,
    onGetMyAllTracksPurchased,
    onGetMyTracksSubscriptionPurchased,
    onGetMyTracksStarPurchased,
    onGetMyTracksPurchased,
    setFilter,
    filter: filterMyTrack,
  } = useMyLibrary();

  const {
    filter,
    loaderMoreRef,
    handleShowAllTrack,
    itemsRef,
    isShowAllTracks,
  } = useTracks();

  const {
    buyTrackOptions,
    sortByTrackMyLibraryOptionsV1,
    sortByTrackCashOptionsV1,
  } = useFilters();

  const [indexOnclickZip, setIndexOnclickZip] = useState(undefined);
  const [order, setOrder] = useState<any>(undefined);

  const trackInOrder = useMemo(
    () => order && order.listTracksPurchased.filter(i => i.numberDownloads > 0),
    [order],
  );

  const handleChange = useCallback(
    e => {
      handleSearch(e.target.value);
    },
    [handleSearch],
  );

  useEffect(() => {
    if (isDisputing) {
      history.push('/home');
    }
  }, [history, isDisputing]);

  useEffect(() => {
    switch (selectedTab) {
      case MY_LIBRARY_TABS.ALL_PURCHASE:
        onGetMyAllTracksPurchased();
        break;
      case MY_LIBRARY_TABS.CASH_PURCHASE:
        onGetMyTracksPurchased();
        break;
      case MY_LIBRARY_TABS.STAR_PURCHASE:
        onGetMyTracksStarPurchased();
        break;
      case MY_LIBRARY_TABS.SUBSCRIPTION_PURCHASE:
        onGetMyTracksSubscriptionPurchased();
        break;
    }
  }, [
    onGetMyAllTracksPurchased,
    onGetMyTracksPurchased,
    onGetMyTracksStarPurchased,
    onGetMyTracksSubscriptionPurchased,
    selectedTab,
  ]);

  const handleOnclickZip = useCallback(
    (item, index) => {
      setIndexOnclickZip(index);
      setOrder(item);
      onOpen();
    },
    [onOpen],
  );

  const handleDownloadZip = () => {
    handleZip(order);
  };

  const renderTracks = useCallback(() => {
    if (isLoadingTrackMyLibrary) {
      return renderLoadingTracks(10);
    }

    if (isMyLibraryCash && myTracksPurchased.length === 0) return <Empty />;
    if (isMyLibraryStar && myTracksStarPurchased.length === 0) return <Empty />;
    if (isMyLibraryAll && myAllTracksPurchased.length === 0) return <Empty />;
    if (isMyLibrarySubscription && myTracksSubscriptionPurchased.length === 0)
      return <Empty />;

    const indexArray = myTracksPurchased.map((_, index) => index);

    const TrackContent = () =>
      isMyLibraryCash
        ? myTracksPurchased.map((item: any, index) => (
            <Accordion key={index} allowMultiple defaultIndex={indexArray}>
              <AccordionItem>
                {({ isExpanded }) => (
                  <Box>
                    <Flex
                      bg="#e9e9e9"
                      fontSize="14px"
                      lineHeight="14px"
                      color="#333333"
                      px="5px"
                      py="10px"
                      mt="20px"
                      mb="5px"
                      alignItems="center"
                      gridGap="15px"
                    >
                      <AccordionButton
                        width="50px"
                        px="10px"
                        py="0px"
                        bg="#E9E9E9"
                      >
                        {isExpanded ? (
                          <BiArrowToTop size={25} color="#000" />
                        ) : (
                          <BiArrowToBottom size={25} color="#000" />
                        )}
                      </AccordionButton>
                      <Box ml="auto">
                        Order:{' '}
                        <Badge p="0px" bg="none" fontWeight={700}>
                          {item.orderId}
                        </Badge>
                      </Box>
                      <Box>
                        Order Date:{' '}
                        <Badge p="0px" bg="none" fontWeight={700}>
                          {formatDate(item.updatedAt)}
                        </Badge>
                      </Box>
                      <Box
                        cursor="pointer"
                        onClick={() => handleOnclickZip(item, index)}
                      >
                        {isLoadingDownloadZip && indexOnclickZip === index ? (
                          <Spinner />
                        ) : (
                          <GrDocumentZip size="25px" />
                        )}
                      </Box>
                    </Flex>
                    <AccordionPanel p="0px" m="0px">
                      {item.listTracksPurchased.map((track, indexTrack) => (
                        <TrackItem
                          key={track.id}
                          index={indexTrack + 1}
                          refEye={el => (itemsRef.current[indexTrack] = el)}
                          track={track}
                          sort={filter?.sort}
                          isShowAllTracks={isShowAllTracks}
                          isMyLibraryPage
                        />
                      ))}
                    </AccordionPanel>
                  </Box>
                )}
              </AccordionItem>
            </Accordion>
          ))
        : (isMyLibraryAll
            ? myAllTracksPurchased
            : isMyLibraryStar
            ? myTracksStarPurchased
            : myTracksSubscriptionPurchased
          ).map((track: any, indexTrack) => {
            return (
              <Box key={indexTrack} mt="20px">
                <TrackItem
                  key={track.id}
                  index={indexTrack + 1}
                  refEye={el => (itemsRef.current[indexTrack] = el)}
                  track={track}
                  sort={filter?.sort}
                  isShowAllTracks={isShowAllTracks}
                  isMyLibraryPage
                />
              </Box>
            );
          });

    return (
      <Box>
        {renderTrackListItem(TrackContent())}
        {isLoadingTrackMyLibrary ? (
          renderLoadingTracks(2)
        ) : (
          <Box ref={loaderMoreRef} />
        )}
      </Box>
    );
  }, [
    filter?.sort,
    handleOnclickZip,
    indexOnclickZip,
    isLoadingTrackMyLibrary,
    isLoadingDownloadZip,
    isMyLibraryAll,
    isMyLibraryCash,
    isMyLibraryStar,
    isMyLibrarySubscription,
    isShowAllTracks,
    itemsRef,
    loaderMoreRef,
    myAllTracksPurchased,
    myTracksPurchased,
    myTracksStarPurchased,
    myTracksSubscriptionPurchased,
  ]);

  return (
    <>
      <HelmetPage title="Tracks Purchased" />
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      {pageHeader?.myLibrary && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.myLibrary)}
        </Box>
      )}
      <Box mt="25px" mb="30px">
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          mt="10px"
          gridGap="10px"
        >
          <Box minW={{ base: '100%', md: '150px' }}>
            <DropDown
              width="100%"
              filters={buyTrackOptions}
              handleChangeDropDown={value => setSelectedTab(value)}
              name="sort"
              value={selectedTab}
            />
          </Box>
          <Box minW={{ base: '100%', md: '150px' }}>
            <DropDown
              filters={
                selectedTab !== MY_LIBRARY_TABS.CASH_PURCHASE
                  ? sortByTrackMyLibraryOptionsV1
                  : sortByTrackCashOptionsV1
              }
              handleChangeDropDown={value =>
                setFilter({
                  ...filterMyTrack,
                  sort: value,
                })
              }
              name="sort"
              value={filterMyTrack?.sort}
              width="100%"
            />
          </Box>
          <Box w="100%">
            <InputSearch
              value={searchValue}
              onChange={handleChange}
              placeholder="Search title or artist of track"
            />
          </Box>
          {ref && (
            <Box
              right={`${
                (window?.innerWidth - ref?.current?.offsetWidth + 6) / 2
              }px`}
              className={styles.iconEye}
              m=" 0px 0px 9px 10px"
            >
              <Box
                onClick={() => handleShowAllTrack(itemsRef)}
                h="20px"
                w="20px"
                cursor="pointer"
              >
                {isShowAllTracks ? (
                  <BsFillEyeSlashFill fontSize="20px" />
                ) : (
                  <IoEyeSharp fontSize="20px" />
                )}
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
      <Box>
        <TrackList
          children={renderTracks()}
          tracks={
            isMyLibraryAll
              ? myAllTracksPurchased
              : isMyLibraryCash
              ? myTracksPurchased
              : isMyLibraryStar
              ? myTracksSubscriptionPurchased
              : myTracksStarPurchased
          }
          isShowExpandedAll={false}
        />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Zip and download {trackInOrder ? trackInOrder.length : 0} tracks in
            order {order?.orderId}?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button bg="#EDF2F7" color="#1A202C" onClick={onClose}>
              No
            </Button>
            <Button
              disabled={isLoadingDownloadZip}
              onClick={handleDownloadZip}
              colorScheme="blue"
              ml={3}
            >
              {isLoadingDownloadZip ? <Spinner /> : 'Yes'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
