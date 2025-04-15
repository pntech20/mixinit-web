import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { toastSuccess } from 'app/helpers/toast';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useMyRelease } from 'app/hooks/myMedia/useMyRelease';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useReleasesSlice } from 'app/pages/Releases/slice';
import { t } from 'i18next';
import { useCallback, useEffect, useRef } from 'react';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import EditorRelease from '../EditorRelease';
import { HelmetPage } from '../HelmetPage';
import ItemsDragLayer from '../MediaUploads/ItemsDragLayer';
import ListTrackUpload from '../MediaUploads/ListTrackUpload';
import ReleaseListForEdit from '../ReleaseListForEdit';
import SearchAndSort from '../SearchAndSort';
import { FaFilter } from 'react-icons/fa';
import IconReturn from 'app/assets/svgs/IconReturn';
import { useCrates } from 'app/hooks/Crates/useCrate';
import FilterItem from '../FilterItem';
import { Ads } from '../Ads';
import { BannerListLabel } from '../BannerListLabel';
import Crate from '../Crate';

export function ReleaseEditor() {
  const itemsRef = useRef<any>([]);
  const dispatch = useDispatch();
  const { actions } = useReleasesSlice();
  const { isLargerThan768, isLargerThan992 } = useMediaScreen();

  const {
    tracks = [],
    onGetTracks,
    handleChangeFilter,
    handleChange: handleChangeTrack,
    filter,
    setFilter,
    handleShowAllTrack,
    isShowAllTracks,
    removeToggleShowFilter,
    searchValue,
    currentPage,
    totalPage,
    isLoading,
    setIsShowFilterTrack,
    isShowFilterTrack,
    onClear,
    handleFilterBpmOrYear,
    range,
    handleFilterCheckbox,
  } = useTracks();
  const { sortByTrackOptionsV1, filtersV1 } = useFilters();
  const { isEditReleaseSuccess, isCreateReleaseSuccess } = useReleases();
  const { setNameCrate } = useCrates();
  const ref = useRef<any>(null);
  const useMyReleaseHook = useMyRelease({ setFilter });
  const {
    idLabel,
    setListFiles,
    setLoadingAction,
    setIsConfirmed,
    resetRelease,
    setReleaseInfo,
    initRealeaseInfo,
    setIsShowSelectLabel,
    handleSetLabelId,
  } = useMyReleaseHook;

  useEffect(() => {
    if (isEditReleaseSuccess) {
      setLoadingAction(false);
      toastSuccess('Edit release success.');
      handleSetLabelId('');
      dispatch(actions.setIsStateRelease(false));
      setIsConfirmed(true);
    }
  }, [
    actions,
    dispatch,
    handleSetLabelId,
    isEditReleaseSuccess,
    setIsConfirmed,
    setLoadingAction,
  ]);

  useEffect(() => {
    if (isCreateReleaseSuccess) {
      setLoadingAction(false);
      toastSuccess('Create Multipack success.');
      setIsShowSelectLabel(false);
      resetRelease();
      setReleaseInfo(initRealeaseInfo);
      setIsConfirmed(false);
    }
  }, [
    initRealeaseInfo,
    isCreateReleaseSuccess,
    resetRelease,
    setIsConfirmed,
    setIsShowSelectLabel,
    setLoadingAction,
    setReleaseInfo,
  ]);

  const history = useHistory();

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  const changeElement = useCallback(
    value => {
      if (value === 'create') {
        resetRelease();
        history.push({
          state: { release: '' },
        });
      } else {
        dispatch(actions.setIsStateRelease(false));
        setListFiles([]);
        handleSetLabelId('');
        if (idLabel !== '') {
          setFilter(prev => ({
            ...prev,
            labelId: '',
            page: 1,
          }));
        }
      }
    },
    [
      actions,
      dispatch,
      handleSetLabelId,
      history,
      idLabel,
      resetRelease,
      setFilter,
      setListFiles,
    ],
  );

  const renderTab = () => {
    return (
      <Box>
        <Box w="100%">
          <Text mb="7px" fontWeight="bold" lineHeight="44px" fontSize="38px">
            MY MEDIA
          </Text>
          <Text fontSize={16} fontWeight={700}>
            Edit tracks, create multipacks, and more..
          </Text>
        </Box>
        <Flex
          display={{ sm: 'block', lg: 'flex' }}
          gridGap="20px"
          justifyContent="space-between"
        >
          <Box w={{ sm: '100%', lg: '75%' }}>
            <Text mt="15px" mb="2px" fontSize="22px" fontWeight={700}>
              Tracks
            </Text>
            <Flex
              gridGap="12px"
              justifyContent="space-between"
              alignItems="center"
            >
              <SearchAndSort
                listSort={
                  filter.search.length > 0
                    ? [
                        {
                          label: 'Relevance',
                          value: '',
                        },
                        ...sortByTrackOptionsV1,
                      ]
                    : sortByTrackOptionsV1
                }
                searchValue={searchValue}
                handleChange={handleChangeTrack}
                valueSort={filter?.sort}
                filter={filter}
                handleChangeFilter={handleChangeFilter}
                handleFilterCheckbox={handleFilterCheckbox}
                placeHolder="Search my tracks"
                isShowCheckboxs
              />
              <Flex gridGap={{ base: '20px', md: '8px' }}>
                <Flex
                  mt="12px"
                  cursor="pointer"
                  onClick={() => setIsShowFilterTrack(!isShowFilterTrack)}
                >
                  <FaFilter fontSize="20px" />
                </Flex>
                <Flex
                  mt="12px"
                  cursor="pointer"
                  onClick={() => handleShowAllTrack(itemsRef)}
                >
                  {isShowAllTracks ? (
                    <BsFillEyeSlashFill fontSize="20px" />
                  ) : (
                    <IoEyeSharp fontSize="20px" />
                  )}
                </Flex>
              </Flex>
            </Flex>

            <Box ref={ref}>
              {isShowFilterTrack && (
                <Flex mb="8px">
                  <FilterItem
                    filterItems={filtersV1}
                    onFilter={handleChangeFilter}
                    handleFilterBpmOrYear={handleFilterBpmOrYear}
                    range={range}
                    onReset={onClear}
                    filter={filter}
                    setFilter={setFilter}
                    isShowPageTrack
                  />
                </Flex>
              )}
              {isShowFilterTrack && (
                <Flex
                  alignItems="center"
                  justify={{ base: 'right', md: 'flex-end' }}
                  mb="8px"
                  style={{ gap: '15px' }}
                >
                  <Flex>
                    <Box
                      cursor="pointer"
                      onClick={() => {
                        onClear(filter?.labelId);
                        setNameCrate('');
                      }}
                    >
                      <IconReturn />
                    </Box>
                  </Flex>
                </Flex>
              )}
            </Box>
            <Box mt="10px" overflowY="auto" height={'calc(100vh - 385px)'}>
              <ListTrackUpload
                isListMyMedia
                listTracksShow={tracks}
                itemsRef={itemsRef}
                idLabel={idLabel}
                filter={filter}
                handleShowAllTrack={handleShowAllTrack}
                currentPage={currentPage}
                totalPage={totalPage}
                setFilter={setFilter}
                isLoading={isLoading}
              />
            </Box>
          </Box>
          <Box w={{ sm: '100%', lg: '25%' }} mt={{ sm: '20px', lg: '0px' }}>
            <Text mt="15px" mb="20px" fontSize="22px" fontWeight={700}>
              Multipacks
            </Text>
            <Tabs variant="unstyled">
              <TabList w="100%">
                <Tab
                  w="50%"
                  mr="10px"
                  border="1px solid black"
                  _selected={{ color: 'white', bg: '#000' }}
                  onClick={() => {
                    changeElement('');
                    setIsShowSelectLabel(false);
                  }}
                >
                  <Text fontSize={12} fontWeight={600}>
                    Create
                  </Text>
                </Tab>
                <Tab
                  w="50%"
                  _selected={{ color: 'white', bg: '#000' }}
                  border="1px solid black"
                  onClick={() => {
                    changeElement('');
                    setIsShowSelectLabel(true);
                  }}
                >
                  <Text fontSize={12} fontWeight={600}>
                    Edit
                  </Text>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel pl="0px" pr="0px" pb="0px">
                  <EditorRelease
                    changeElement={changeElement}
                    useMyReleaseHook={useMyReleaseHook}
                    setFilter={setFilter}
                  />
                </TabPanel>
                <TabPanel pl="0px" pr="0px" pb="0px">
                  <ReleaseListForEdit
                    changeElement={changeElement}
                    useMyReleaseHook={useMyReleaseHook}
                    setFilter={setFilter}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Box>
    );
  };

  const message = t('uploader.message');
  return (
    <Box>
      <HelmetPage title="My Media" />
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
      {isLargerThan768 ? (
        <Box>
          <ItemsDragLayer />
          {renderTab()}
        </Box>
      ) : (
        <Text pt="100px" textAlign="center" fontWeight="500" fontSize="24px">
          {message}
        </Text>
      )}
    </Box>
  );
}
