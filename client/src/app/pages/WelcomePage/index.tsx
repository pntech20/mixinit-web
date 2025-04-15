import { Box, Flex, Image, SimpleGrid, Text } from '@chakra-ui/react';
import Logo from 'app/assets/images/banner/logo-welcome.png';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import Empty from 'app/components/Empty';
import { HelmetPage } from 'app/components/HelmetPage';
import ReleaseItem from 'app/components/ReleaseItem';
import TrackItem from 'app/components/TrackItem';
import TrackList from 'app/components/TrackList';
import {
  renderLoadingTracks,
  renderTrackListItem,
} from 'app/components/TrackUtils/track';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useSections } from 'app/hooks/sections/useSections';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { useCallback, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';
import { generateArray } from 'app/helpers/functions';
import SkeletonItem from 'app/components/SkeletonItem';

export function WelcomePage() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const history = useHistory();
  const { isDarkMode } = useModeTheme();
  const { sections = [], onGetSections, isLoading } = useSections();
  const { onGetReleases, releases } = useReleases();
  const { onGetCommunity, users } = useCommunity();

  const newUsers = (users || []).filter(
    user => user?._id !== '66e8627caf0a44ca6052e391',
  );

  const {
    tracks = [],
    onGetTracks,
    itemsRef,
    filter,
    isShowAllTracks,
    isLoading: isLoadingTracks,
  } = useTracks();

  const { isLargerThan992, isLargerThan500 } = useMediaScreen();

  useEffect(() => {
    onGetSections();
  }, [onGetSections]);

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    onGetReleases();
  }, [onGetReleases]);

  useEffect(() => {
    onGetCommunity();
  }, [onGetCommunity]);

  const renderUILoadMore = useCallback(
    () => (
      <Box>
        <SimpleGrid gridGap="20px" columns={{ base: 1, sm: 2, lg: 5, xl: 5 }}>
          {generateArray(5).map(item => (
            <SkeletonItem
              isBanner={true}
              height="350px"
              borderRadius="10px"
              key={item}
            />
          ))}
        </SimpleGrid>
      </Box>
    ),
    [],
  );

  const renderLabel = useCallback(() => {
    if (isLoading) return renderUILoadMore();
    if (!sections?.length) return <Empty />;
    return (
      <Box mt="10px">
        <SimpleGrid
          gridGap="20px"
          rowGap="20px"
          columns={{ base: 1, sm: 2, md: 4, lg: 6 }}
        >
          {sections.map((section, index) => {
            return (
              <Box
                key={index}
                borderRadius="11px"
                bgColor="#000"
                position="relative"
              >
                <Box
                  textAlign="center"
                  bg="#ffffff80"
                  w="100%"
                  position="absolute"
                  fontWeight={800}
                  fontSize="16px"
                  color="#fff"
                  top="0px"
                  cursor="pointer"
                  zIndex={10}
                  onClick={() =>
                    history.push({
                      pathname: `/${'labels'}/${section?.slug}`,
                      search: `?tab=1&sort=30`,
                      state: { dataRange: String(30) },
                    })
                  }
                  _hover={{ bg: '#000' }}
                >
                  TOP TRACKS
                </Box>
                <Image
                  onClick={() => history.push(`/labels/${section?.slug}?tab=1`)}
                  position="relative"
                  w="100%"
                  src={section?.squareImageUrl}
                  p="10px"
                  cursor="pointer"
                  transition="transform 0.3s ease-in-out"
                  _hover={{ transform: 'scale(1.1)' }}
                />
                <Box
                  onClick={() =>
                    history.push({
                      pathname: `/${'labels'}/${section?.slug}`,
                      search: `?tab=2&sort=30`,
                    })
                  }
                  textAlign="center"
                  bg="#ffffff80"
                  w="100%"
                  position="absolute"
                  fontWeight={800}
                  fontSize="16px"
                  color="#fff"
                  bottom="0px"
                  cursor="pointer"
                  _hover={{ bg: '#000' }}
                >
                  TOP MUTIPACKS
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }, [history, isLoading, renderUILoadMore, sections]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, tracks.length);
  }, [itemsRef, tracks.length]);
  const renderTracks = () => {
    if (isLoadingTracks) {
      return renderLoadingTracks(10);
    }

    if (!tracks.length) return <Empty />;

    const TrackContent = () =>
      (tracks || []).map((track, index) => (
        <TrackItem
          key={track.id}
          index={index + 1}
          refEye={el => (itemsRef.current[index] = el)}
          track={track}
          sort={filter?.sort}
          isShowAllTracks={isShowAllTracks}
        />
      ));

    return <Box>{renderTrackListItem(TrackContent())}</Box>;
  };

  const Banner = ({ title, text }: { title: string; text: string }) => {
    return (
      <Flex
        w="100%"
        p="25px 0"
        flexDirection={isLargerThan500 ? 'row' : 'column'}
      >
        <Image
          maxW={isLargerThan500 ? '220px' : '100%'}
          w="100%"
          h="auto"
          src={Logo}
          fallbackSrc={Logo}
          objectFit="contain"
          mr="10px"
        />
        <Box mt={isLargerThan500 ? '0px' : '10px'}>
          <Text
            style={{
              fontFamily:
                'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, sans-serif',
            }}
            fontSize={isLargerThan500 ? '44px' : '40px'}
            lineHeight={isLargerThan500 ? '44px' : '40px'}
            fontWeight={700}
            mb="10px"
            textAlign={isLargerThan500 ? 'left' : 'center'}
          >
            {title}
          </Text>
          <Text
            style={{ fontFamily: 'Exo, sans-serif' }}
            fontSize={isLargerThan500 ? '22px' : '18px'}
            fontWeight={600}
            lineHeight="22px"
            textAlign={isLargerThan500 ? 'left' : 'center'}
          >
            {text} / LAST 30 DAYS
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <Box position="relative">
      <HelmetPage title="Welcome" />
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
      {pageHeader?.home && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.home)}
        </Box>
      )}
      <Flex flexDirection="column" gridGap="40px">
        <Box
          bg={isDarkMode ? ' ' : '#f3f3f3'}
          p="5px 10px 10px"
          borderRadius="5px"
          border="1px solid #e6e6e6"
          w="100%"
        >
          <Banner title="TRACKS" text="ALL LABELS" />
          <TrackList
            children={renderTracks()}
            tracks={tracks}
            isShowExpandedAll={false}
          />
          <Text
            color="#007bff"
            cursor="pointer"
            textDecoration="underline"
            style={{ fontWeight: '600', fontSize: '16px' }}
            onClick={() =>
              history.push({
                pathname: `/tracks`,
                search: `?sort=30`,
              })
            }
          >
            view more
          </Text>
        </Box>
        <Box
          bg={isDarkMode ? ' ' : '#f3f3f3'}
          p="5px 10px 10px"
          borderRadius="5px"
          border="1px solid #e6e6e6"
          w="100%"
        >
          <Banner title="MULTIPACKS" text="ALL LABELS" />
          <Box mb="15px">
            <SimpleGrid
              gridGap="10px"
              rowGap="15px"
              columns={{ base: 1, sm: 2, md: 4, lg: 5 }}
            >
              {releases.map(item => (
                <ReleaseItem key={item._id} release={item} isHomePage />
              ))}
            </SimpleGrid>
          </Box>
          <Text
            color="#007bff"
            textDecoration="underline"
            style={{ fontWeight: '600', fontSize: '16px' }}
            cursor="pointer"
            onClick={() =>
              history.push({
                pathname: `/multipacks`,
                search: `?sort=30`,
              })
            }
          >
            view more
          </Text>
        </Box>
        <Box
          bg={isDarkMode ? ' ' : '#f3f3f3'}
          p="5px 10px 10px"
          borderRadius="5px"
          border="1px solid #e6e6e6"
          w="100%"
        >
          <Banner title="CHARTS" text="BY LABEL" />
          {renderLabel()}
          <Text
            color="#007bff"
            textDecoration="underline"
            style={{ fontWeight: '600', fontSize: '16px' }}
            cursor="pointer"
            pt="10px"
            onClick={() =>
              history.push({
                pathname: `/labels`,
              })
            }
          >
            view more
          </Text>
        </Box>
        <Box
          bg={isDarkMode ? ' ' : '#f3f3f3'}
          p="5px 10px 10px"
          borderRadius="5px"
          border="1px solid #e6e6e6"
          w="100%"
        >
          <Banner title="CONTRIBUTORS" text="ALL LABELS" />
          <SimpleGrid
            mt="25px"
            gridGap="14px"
            rowGap="14px"
            columns={{ base: 1, sm: 2, md: 4, lg: 5 }}
          >
            {newUsers.map((item: any, idx) => (
              <Box
                key={idx}
                sx={{ borderRadius: '11px' }}
                bgColor="#000"
                position="relative"
              >
                <Box
                  textAlign="center"
                  bg="#ffffff80"
                  w="100%"
                  position="absolute"
                  fontWeight={800}
                  fontSize="16px"
                  color="#fff"
                  top="0px"
                  cursor="pointer"
                  zIndex={10}
                  onClick={() =>
                    history.push({
                      pathname: `contributors/${item?.slug}`,
                      search: `?tab=1&sort=30`,
                      state: { dataRange: String(30) },
                    })
                  }
                  _hover={{ bg: '#000' }}
                >
                  TOP TRACKS
                </Box>
                <Image
                  onClick={() => history.push(`/contributors/${item?.slug}`)}
                  position="relative"
                  w="100%"
                  src={item?.avatar || PlaceholderBgDefault}
                  fallbacksrc={PlaceholderBgDefault}
                  width="100%"
                  objectFit="cover"
                  sx={{ borderRadius: '10px' }}
                  cursor="pointer"
                />
                <Box
                  onClick={() =>
                    history.push({
                      pathname: `/contributors/${item?.slug}`,
                      search: `?tab=2&sort=30`,
                    })
                  }
                  textAlign="center"
                  bg="#ffffff80"
                  w="100%"
                  position="absolute"
                  fontWeight={800}
                  fontSize="16px"
                  color="#fff"
                  bottom="0px"
                  cursor="pointer"
                  _hover={{ bg: '#000' }}
                >
                  TOP MUTIPACKS
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          <Text
            color="#007bff"
            textDecoration="underline"
            style={{ fontWeight: '600', fontSize: '16px' }}
            cursor="pointer"
            pt="10px"
            onClick={() =>
              history.push({
                pathname: `/contributors`,
                search: `?sort=30`,
              })
            }
          >
            view more
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
