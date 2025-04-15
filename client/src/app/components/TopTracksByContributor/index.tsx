import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import { renderLoadingTracks } from 'app/components/TrackUtils/track';
import { generateArray } from 'app/helpers/functions';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useCallback, useEffect } from 'react';
import { BannerTopTrack } from '../BannerTopTrack';
import ButtonTop from '../ButtonTop';
import LabelInfo from '../LabelInfo';
import ReleaseItem from '../ReleaseItem';
import ShowTopTrackItem from '../ShowTopTrackItem';
import SkeletonItem from '../SkeletonItem';

export function TopTracksByContributor({
  search,
  sort,
  labelId,
  hookTopTrack,
  selectedTime,
  hookTopMultipacksByContributor,
  selectedTimeForReleaseByContributor,
}: any) {
  const { users = [], isLoading, onGetCommunity } = useCommunity();

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

  const {
    updateWishlistStatusForTopRelease,
    visibleReleasesIndex,
    handleClickTopRelease,
    loadingReleaseIndexes,
    itemReleaseData,
    setVisibleReleasesIndex,
    setItemReleaseData,
  } = hookTopMultipacksByContributor;

  useEffect(() => {
    onGetCommunity({
      pageSize: 1000,
      search,
      sort: 'lastUploadTrack@desc',
    });
  }, [onGetCommunity, search, sort]);

  useEffect(() => {
    setVisibleTracksIndex({});
    setItemData({});
    setVisibleReleasesIndex({});
    setItemReleaseData({});
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
    setVisibleReleasesIndex,
    setItemReleaseData,
  ]);

  const renderUILoadMore = useCallback(
    numberItem => (
      <Box>
        <SimpleGrid
          gridGap="10px"
          rowGap="15px"
          columns={{ base: 1, sm: 2, md: 4, lg: 5 }}
        >
          {generateArray(numberItem).map(item => (
            <SkeletonItem borderRadius="10px" key={item} />
          ))}
        </SimpleGrid>
      </Box>
    ),
    [],
  );

  const renderListTopTrackByLabel = () => {
    if (isLoading) {
      return renderLoadingTracks(5);
    }
    if (users && users.length <= 0) return <Empty />;
    return (
      <SimpleGrid
        gap="10px"
        columns={{ base: 1 }}
        alignItems="center"
        mt="20px"
        mb="10px"
      >
        {users
          ?.filter(user => user?._id !== '66e8627caf0a44ca6052e391')
          .map((item: any, idx: any) => {
            const dataKey = `${idx}-${selectedTime}`;
            return (
              <Box key={idx}>
                <Flex
                  position="relative"
                  border="1px solid #ddd4d4"
                  borderRadius="5px"
                  h="80px"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <LabelInfo fontMobile="system-ui" item={item} />
                  <ButtonTop
                    id={item._id}
                    text="TRACKS"
                    handClickTop={handleClick}
                    selectedTime={selectedTime}
                    idx={idx}
                    labelId={labelId}
                    value="user"
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
                  id={item.slug}
                  page="contributors"
                />
              </Box>
            );
          })}
      </SimpleGrid>
    );
  };

  const renderListTopReleaseByLabel = () => {
    if (isLoading) {
      return renderLoadingTracks(5);
    }
    if (users && users.length <= 0) return <Empty />;
    return (
      <SimpleGrid
        gap="10px"
        columns={{ base: 1 }}
        alignItems="center"
        my="20px"
      >
        {users
          ?.filter(user => user?._id !== '66e8627caf0a44ca6052e391')
          .map((item: any, idx: any) => {
            const dataKey = `${idx}-${selectedTimeForReleaseByContributor}`;
            return (
              <Box key={idx}>
                <Flex
                  position="relative"
                  border="1px solid #ddd4d4"
                  borderRadius="5px"
                  h="80px"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <LabelInfo fontMobile="system-ui" item={item} />
                  <ButtonTop
                    id={item._id}
                    text=" TOP 20 MULTIPACKS"
                    handClickTop={handleClickTopRelease}
                    selectedTime={selectedTimeForReleaseByContributor}
                    idx={idx}
                  />
                </Flex>
                {visibleReleasesIndex[dataKey] && (
                  <Box border="1px solid #bdbdbd" borderTop="0px">
                    {loadingReleaseIndexes.includes(dataKey) ? (
                      <Box my="15px">{renderUILoadMore(5)}</Box>
                    ) : (
                      <>
                        {itemReleaseData[dataKey].length === 0 && (
                          <Box my="15px">
                            <Empty />
                          </Box>
                        )}
                        {itemReleaseData[dataKey].length > 0 && (
                          <Box mb="15px" p="10px">
                            <SimpleGrid
                              gridGap="10px"
                              rowGap="15px"
                              columns={{ base: 1, sm: 3, lg: 5 }}
                            >
                              {itemReleaseData[dataKey].map((item, idx) => (
                                <ReleaseItem
                                  isChartsPage
                                  updateWishlistStatusForTopRelease={
                                    updateWishlistStatusForTopRelease
                                  }
                                  key={item._id}
                                  release={item}
                                />
                              ))}
                            </SimpleGrid>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
      </SimpleGrid>
    );
  };

  return (
    <Box mt="35px">
      <BannerTopTrack text="BY CONTRIBUTOR" />
      {renderListTopTrackByLabel()}
      <Box mt="20px">
        <BannerTopTrack title="TOP 20 MULTIPACKS" text="BY CONTRIBUTOR" />
        {renderListTopReleaseByLabel()}
      </Box>
    </Box>
  );
}
