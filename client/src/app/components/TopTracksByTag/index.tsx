import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import { renderLoadingTracks } from 'app/components/TrackUtils/track';
import { useTags } from 'app/hooks/tags/useTags';
import { useEffect, useRef } from 'react';
import { BannerTopTrack } from '../BannerTopTrack';
import ButtonTop from '../ButtonTop';
import ShowTopTrackItem from '../ShowTopTrackItem';

export function TopTracksByTag({
  search,
  sort,
  labelId,
  hookTopTrack,
  selectedTime,
}: any) {
  const { onGetTags, tags, isLoading } = useTags();
  const {
    updateWishlistStatus,
    dispatch,
    actions,
    isFilterGlobalPageHome,
    visibleTracksIndex,
    handleClick,
    loadingIndexes,
    itemData,
    setVisibleTracksIndex,
    setItemData,
    handleOpenBuyTrack,
    handleOpenBuyTrackBySub,
  } = hookTopTrack;

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onGetTags({ search, sort });
  }, [onGetTags, search, sort]);

  useEffect(() => {
    setVisibleTracksIndex({});
    setItemData({});
    if (isFilterGlobalPageHome) {
      dispatch(actions.isFilterGlobalPageHome(false));
    }
  }, [
    actions,
    dispatch,
    isFilterGlobalPageHome,
    setItemData,
    setVisibleTracksIndex,
    labelId,
    search,
    sort,
  ]);

  const renderListTopTagByLabel = () => {
    if (isLoading) {
      return renderLoadingTracks(5);
    }
    if (tags && tags.length <= 0) return <Empty />;
    return (
      <SimpleGrid
        gap="10px"
        columns={{ base: 1 }}
        alignItems="center"
        my="20px"
      >
        {tags?.map((item: any, idx: any) => {
          const dataKey = `${idx}-${selectedTime}`;
          return (
            <Box key={idx}>
              <Flex
                position="relative"
                border="1px solid #ddd4d4"
                borderRadius="5px"
                borderBottomLeftRadius="0px"
                borderBottomRightRadius="0px"
                h="80px"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  pl="15px"
                  fontFamily={{ base: 'system-ui', md: 'Rubik80sFade' }}
                  fontSize={{ base: '20px', md: '30px' }}
                  fontWeight={800}
                  lineHeight="35px"
                >
                  {item.name}
                </Text>
                <ButtonTop
                  id={item._id}
                  text="TRACKS"
                  handClickTop={handleClick}
                  selectedTime={selectedTime}
                  idx={idx}
                  labelId={labelId}
                  value="tags"
                />
              </Flex>
              <ShowTopTrackItem
                visibleTracksIndex={visibleTracksIndex}
                dataKey={dataKey}
                loadingIndexes={loadingIndexes}
                itemData={itemData}
                renderLoadingTracks={renderLoadingTracks}
                updateWishlistStatus={updateWishlistStatus}
                handleOpenBuyTrackBySub={handleOpenBuyTrackBySub}
                handleOpenBuyTrack={handleOpenBuyTrack}
                selectedTime={selectedTime}
                id={item._id}
                page="tracks"
                label="showTags"
              />
            </Box>
          );
        })}
      </SimpleGrid>
    );
  };

  return (
    <Box mt="35px">
      <BannerTopTrack text="BY #TAG" />
      {renderListTopTagByLabel()}
    </Box>
  );
}
