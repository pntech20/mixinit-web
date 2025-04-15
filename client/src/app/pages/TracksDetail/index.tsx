import { Box, Flex } from '@chakra-ui/react';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import { BannerTrackDetail } from 'app/components/BannerTrackDetail';
import Crate from 'app/components/Crate';
import { HelmetPage } from 'app/components/HelmetPage';
import SkeletonItem from 'app/components/SkeletonItem';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useTrackDetail } from 'app/hooks/tracks/useTrackDetail';
import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
export function TrackDetail() {
  const {
    tabOptions,
    selectedTab,
    onChangeTab,
    setSelectedTab,
    trackInfo,
    onGetTrackDetail,
  } = useTrackDetail();
  const { search } = useLocation();

  const tab: any = queryString.parse(search)?.tab;

  const slug = window?.location?.href.split('/tracks/')[1];

  console.log('slug', slug);

  const ref = useRef<any>(null);

  useEffect(() => {
    onGetTrackDetail(slug);
  }, [onGetTrackDetail, slug]);

  const indexTabOptions = tabOptions.findIndex(i => i.value === selectedTab);

  useEffect(() => {
    if (tab) setSelectedTab(tab);
  }, [setSelectedTab, tab]);

  const { isLargerThan500, isLargerThan992 } = useMediaScreen();

  return (
    <>
      <HelmetPage title="Track detail" />
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
      <Flex
        mt="20px"
        gridGap="5px"
        flexWrap="wrap"
        direction={isLargerThan500 ? 'row' : 'column'}
      >
        {tabOptions.map((item, index) => (
          <Flex
            key={index}
            color={selectedTab === item.value ? '#000' : '#fff'}
            cursor="pointer"
            bg={selectedTab === item.value ? '#fff' : '#000'}
            border="1px solid #505050"
            borderBottom={selectedTab === item.value ? '0px' : '1px'}
            alignItems="center"
            justifyContent="center"
            p="9px 30px"
            fontWeight="700"
            fontSize="12px"
            _hover={{ backgroundColor: '#fff', color: '#000' }}
            boxShadow={
              selectedTab === item.value
                ? '0 2px 5px 1px rgba(0, 0, 0, .2)'
                : ''
            }
            onClick={() => onChangeTab(index)}
          >
            {item.label}
          </Flex>
        ))}
      </Flex>

      {indexTabOptions === 0 && (
        <Box>
          {trackInfo ? (
            <Box mt="20px" w="100%" ref={ref}>
              <BannerTrackDetail track={trackInfo} />
            </Box>
          ) : (
            <Box w="100%" mt="20px" ref={ref}>
              <SkeletonItem height="450px" isBanner borderRadius="10px" />
            </Box>
          )}
        </Box>
      )}

      {indexTabOptions !== 0 && (
        <Box mt="20px">{tabOptions[indexTabOptions].component}</Box>
      )}
    </>
  );
}
