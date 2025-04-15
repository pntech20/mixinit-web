import {
  AlertDialogBody,
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { HelmetPage } from 'app/components/HelmetPage';
import TimeSelector from 'app/components/TimeSelector';
import { TopTracksByContributor } from 'app/components/TopTracksByContributor';
import { TopTracksByGenre } from 'app/components/TopTracksByGenre';
import { TopTracksByLabel } from 'app/components/TopTracksByLabel';
import { TopTracksByTag } from 'app/components/TopTracksByTag';
import { DATE_RANGE } from 'app/constants/enum';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useTopReleaseByContributor } from 'app/hooks/topMultipackByContributor';
import { useTopReleaseByLabel } from 'app/hooks/topMultipackByLabel';
import { useTopTrack } from 'app/hooks/topTrack';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { default as queryString } from 'query-string';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSearch } from 'react-icons/bi';
import { useHistory, useLocation } from 'react-router-dom';

export function ChartsPage() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isLightMode } = useModeTheme();

  const history = useHistory();
  const { search: searchUrl } = useLocation();
  const query: any = queryString.parse(searchUrl);
  const tabs = ['Genres', 'Tags', 'Labels', 'Contributors'];
  const useChartsHook = useTopTrack();
  const useChartsHookTopReleaseByLabel = useTopReleaseByLabel();
  const useChartsHookTopReleaseByContributor = useTopReleaseByContributor();
  const { isLargerThan613 } = useMediaScreen();
  const { handleInputFocus, handleInputBlur } = usePlayers();

  const { t } = useTranslation();

  const {
    isShowModalBuyTrackByStarPageChart,
    onCloseModalBuyTrackByStarPageChart,
    isShowModalBuyTrackBySubPageChart,
    onCloseModalBuyTrackBySubPageChart,
    isLoadingBuyTrackPageChart,
    buyTrackByStarPageChart,
    buyTrackBySubPageChart,
    isFilterGlobalPageHome,
    trackId,
    sortByOptionsLabel,
    sections,
    tab,
    setTab,
    search,
    setSearch,
    sort,
    setSort,
    labelId,
    setLabelId,
    handleFilter,
    handleChange,
    selectedTime,
    setSelectedTime,
    handleTimeChange,
    onChange,
  } = useChartsHook;
  const { isLargerThan992 } = useMediaScreen();

  const {
    selectedTimeForRelease,
    handleTimeChangeForTopRelease,
    setSelectedTimeForRelease,
  } = useChartsHookTopReleaseByLabel;

  const {
    selectedTimeForReleaseByContributor,
    setSelectedTimeForReleaseByContributor,
    handleTimeChangeForTopReleaseByContributor,
  } = useChartsHookTopReleaseByContributor;

  useEffect(() => {
    const query = queryString.parse(searchUrl);
    if (query && query.tab) {
      setTab(+query.tab);
    }
  }, [searchUrl, setTab]);

  useEffect(() => {
    if (isFilterGlobalPageHome) {
      setSearch('');
      setSort('name@asc');
      setLabelId('');
      setSelectedTime(DATE_RANGE.LAST_30_DAYS);
      setSelectedTimeForReleaseByContributor(DATE_RANGE.LAST_30_DAYS);
      setSelectedTimeForRelease(DATE_RANGE.LAST_30_DAYS);
    }
  }, [
    isFilterGlobalPageHome,
    setLabelId,
    setSearch,
    setSelectedTime,
    setSelectedTimeForRelease,
    setSelectedTimeForReleaseByContributor,
    setSort,
  ]);

  return (
    <Box>
      <HelmetPage title="Charts" />
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
      <Box
        borderRadius="5px"
        bg={isLightMode ? '#f8f8f8' : 'none'}
        p="10px"
        pl="0px"
      >
        {pageHeader?.chart && (
          <Box
            mb="15px"
            className={
              !isLightMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
            }
          >
            {renderDraftToHtml(pageHeader?.chart)}
          </Box>
        )}
        <Flex w="100%" flexWrap="wrap">
          {query && query?.tab !== '3' && (
            <Flex minW="180px">
              <Box mr={{ base: '15px', md: '12px' }}>
                <Text
                  pb="1px"
                  fontSize="12px"
                  color={isLightMode ? '#616161' : '#fff'}
                  fontWeight={600}
                >
                  Label:
                </Text>
                <Select
                  fontSize="12px"
                  fontWeight={700}
                  onChange={e => handleFilter('labelId', e.target.value)}
                  value={labelId}
                >
                  {[{ name: 'All Labels', _id: '' }, ...sections].map(
                    (item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ),
                  )}
                </Select>
              </Box>
            </Flex>
          )}

          {tab !== 4 && (
            <Flex minW="130px">
              <Box mr={{ base: '15px', md: '12px' }}>
                <Text
                  pb="1px"
                  fontSize="12px"
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  color={useColorModeValue('#616161', '#fff')}
                  fontWeight={600}
                >
                  Sort by:
                </Text>
                <Select
                  fontSize="12px"
                  fontWeight={700}
                  paddingLeft="5px"
                  onChange={e => handleFilter('sort', e.target.value)}
                  value={sort}
                >
                  {[...sortByOptionsLabel].map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          )}
          <Flex
            minW="130px"
            mt={{ base: '10px', sm: isLargerThan613 ? '0px' : '10px' }}
          >
            <Box mr={{ base: '15px', md: '12px' }}>
              <Text
                pb="1px"
                fontSize="12px"
                color={useColorModeValue('#616161', '#fff')}
                fontWeight={600}
              >
                Date Range:
              </Text>
              <TimeSelector
                isTop10ListsPage
                selectedTime={selectedTime}
                onChangeTime={newTime => {
                  handleTimeChange(
                    newTime,
                    labelId,
                    ['genre', 'tags', 'label', 'user'][tab - 1],
                  );
                  handleTimeChangeForTopRelease(newTime, 'item');
                  handleTimeChangeForTopReleaseByContributor(newTime, 'item');
                }}
              />
            </Box>
          </Flex>
        </Flex>
        <Flex w="100%" mt="10px">
          <Box w="100%">
            <Text
              pb="1px"
              fontSize="12px"
              color={useColorModeValue('#616161', '#fff')}
              fontWeight={600}
            >
              Search:
            </Text>
            <InputGroup>
              <InputLeftElement
                alignItems="center"
                h="100%"
                pointerEvents="none"
                children={<BiSearch color="gray.300" />}
              />
              <Input
                borderRadius="4px"
                type="text"
                size="sm"
                h={'40px'}
                placeholder="Search Charts..."
                _placeholder={{ color: '#d4d4d4' }}
                onChange={e => handleChange(e)}
                value={search}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </InputGroup>
          </Box>
        </Flex>
      </Box>
      <Flex my="20px">
        {tabs.map((t, idx) => {
          return (
            <Box
              className="tab-item"
              cursor="pointer"
              bg={idx + 1 === tab ? '#fff' : '#000'}
              height="max-content"
              key={idx}
              onClick={() => {
                setSearch('');
                setSort('name@asc');
                setLabelId('');
                setSelectedTime(DATE_RANGE.LAST_30_DAYS);
                setTab(idx + 1);
                history.push({
                  pathname: `/charts`,
                  search: `?tab=${idx + 1}`,
                });
              }}
              boxShadow={
                idx + 1 === tab ? '0 2px 5px 1px rgba(0, 0, 0, 0.2)' : 'unset'
              }
            >
              <Text
                color={idx + 1 !== tab ? '#fff' : '#000'}
                fontSize={12}
                fontWeight={600}
              >
                {t}
              </Text>
            </Box>
          );
        })}
      </Flex>
      {tab === 1 && (
        <TopTracksByGenre
          search={search}
          sort={sort}
          labelId={labelId}
          hookTopTrack={useChartsHook}
          selectedTime={selectedTime}
        />
      )}
      {tab === 2 && (
        <TopTracksByTag
          search={search}
          sort={sort}
          labelId={labelId}
          hookTopTrack={useChartsHook}
          selectedTime={selectedTime}
        />
      )}
      {tab === 3 && (
        <TopTracksByLabel
          search={search}
          sort={sort}
          hookTopTrack={useChartsHook}
          hookTopMultipacks={useChartsHookTopReleaseByLabel}
          selectedTime={selectedTime}
          selectedTimeForRelease={selectedTimeForRelease}
        />
      )}
      {tab === 4 && (
        <TopTracksByContributor
          search={search}
          sort={sort}
          labelId={labelId}
          hookTopTrack={useChartsHook}
          selectedTime={selectedTime}
          hookTopMultipacksByContributor={useChartsHookTopReleaseByContributor}
          selectedTimeForReleaseByContributor={
            selectedTimeForReleaseByContributor
          }
        />
      )}
      <Modal
        isOpen={isShowModalBuyTrackByStarPageChart}
        onClose={() => onCloseModalBuyTrackByStarPageChart()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('buyTrack.confirm')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t('buyTrack.useStar', { price: 1 })}</ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoadingBuyTrackPageChart}
              onClick={() => {
                buyTrackByStarPageChart(trackId);
              }}
              variant="ghost"
            >
              {t('buyTrack.continue')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        onClose={onCloseModalBuyTrackBySubPageChart}
        isOpen={isShowModalBuyTrackBySubPageChart}
      >
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>You are buying track by subscription?</ModalHeader>
            <AlertDialogBody>
              <Checkbox mt="10px" onChange={onChange}>
                <Text fontSize="14px">Don't Show Again</Text>
              </Checkbox>
            </AlertDialogBody>
            <ModalFooter>
              <Button
                bg="#EDF2F7"
                color="#1A202C"
                onClick={onCloseModalBuyTrackBySubPageChart}
              >
                Close
              </Button>
              <Button
                bg="#EDF2F7"
                color="#1A202C"
                ml="10px"
                onClick={() => buyTrackBySubPageChart(trackId)}
              >
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </Box>
  );
}
