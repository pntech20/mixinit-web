import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { BannerReleaseDetail } from 'app/components/BannerReleaseDetail';
import { HelmetPage } from 'app/components/HelmetPage';
import SkeletonItem from 'app/components/SkeletonItem';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useGeneral } from 'app/hooks/general/useGeneral';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { selectReleaseDetail } from 'app/pages/ReleaseDetail/slice/selectors';
import { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import './styles.scss';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';
import CartButton from 'app/components/CartButton';
import { TracksAndPagination } from 'app/components/TracksAndPaganation';
import { formatMoney } from 'app/utils/currency';
import { IoEyeSharp } from 'react-icons/io5';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';

export function ReleaseDetail() {
  const { releaseDetail } = useSelector(selectReleaseDetail);
  const useReleasesHook = useReleases();
  const useTracksHook = useTracks();
  const { isLightMode } = useModeTheme();
  const { onGetReleaseDetail } = useReleasesHook;
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();

  const {
    tracks,
    onGetTracks,
    filter,
    currentPage,
    setFilter,
    isShowFilter,
    isLoadingMore,
    handleShowAllTrack,
    isShowAllTracks,
    totalPage,
    isLoading,
    onHandleClickItemTagGenre,
  } = useTracksHook;

  const { setIsScrollPastFilter, setIsNotScrollPastFilter, scrollValue } =
    useGeneral();

  const { slug: id } = useParams<{ slug: string }>();
  const itemsRef = useRef<any>([]);
  const ref = useRef<any>(null);

  const { isLargerThan992, isLargerThan780 } = useMediaScreen();

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  useEffect(() => {
    onGetReleaseDetail(id);
  }, [id, onGetReleaseDetail]);

  useEffect(() => {
    if (scrollValue < 50 && scrollValue !== 0) {
      setIsScrollPastFilter();
    } else if (scrollValue < 370 && isShowFilter) {
      setIsScrollPastFilter();
    } else {
      setIsNotScrollPastFilter();
    }
  }, [
    isShowFilter,
    scrollValue,
    setIsNotScrollPastFilter,
    setIsScrollPastFilter,
  ]);

  return (
    <>
      <HelmetPage title="Multipacks detail" />
      {pageHeader?.release && (
        <Box mb="20px" className={'pageTopHeaderDarkMode'}>
          {renderDraftToHtml(pageHeader?.release)}
        </Box>
      )}
      {/* <Box className="banner-release">
        <Image
          className="banner-release-image"
          src={releaseDetail?.user.avatar || logoIconLight}
        />
      </Box> */}
      <Flex
        gridGap="20px"
        display={{ lg: 'flex', base: 'block' }}
        color={'white'}
      >
        {!releaseDetail ? (
          <Box w={{ lg: '25%', base: '100%' }} ref={ref}>
            <SkeletonItem
              // height={`${heightBanner}px`}
              isBanner
              borderRadius="10px"
            />
          </Box>
        ) : (
          <Box
            w={{ lg: '25%', base: '100%' }}
            ref={ref}
            mt={isLargerThan992 ? '0px' : isLargerThan780 ? '40px' : '0px'}
          >
            <BannerReleaseDetail
              release={releaseDetail}
              useReleasesHook={useReleasesHook}
              useTracksHook={useTracksHook}
              itemsRef={itemsRef}
            />
          </Box>
        )}

        <Box w={{ lg: '75%', base: '100%' }} color={'white'}>
          <Box mb="30px" justifyContent="space-between" flexWrap="wrap">
            <Box minH="70px" p={{ md: '5px' }}>
              {!isLoadingMore && releaseDetail && (
                <Box>
                  <Text
                    fontSize="14px"
                    fontWeight={400}
                    pb="10px"
                    px={{ md: '5px' }}
                    color={'#fff'}
                  >
                    This multipack is brought to you by:
                  </Text>
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gridGap={{ base: '12px', md: '0px' }}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex gridGap="10px" pb="10px">
                      <Link to={`/contributors/${releaseDetail?.user?.slug}`}>
                        <Flex align="center" gridGap="5px">
                          <Image
                            src={
                              releaseDetail?.user?.avatar ||
                              PlaceholderBgDefault
                            }
                            width="100px"
                            height="100px"
                          />
                          <Text fontSize="16px" fontWeight={600} color={'#fff'}>
                            {releaseDetail?.user.username}
                          </Text>
                        </Flex>
                      </Link>
                    </Flex>

                    {/* <Flex alignItems="center" gridGap="10px">
                      {releaseDetail && (
                        <Flex className="action-section">
                          <Box className="track">
                            <Text fontWeight={800}>
                              {releaseDetail?.trackByRelease ?? 0} TRACKS{' '}
                            </Text>
                          </Box>
                          <Box className="save">
                            <Text>
                              SAVE {formatMoney(releaseDetail?.savePrice)}
                            </Text>
                          </Box>
                          <Box className="cart">
                            {releaseDetail?.user?._id !==
                            releaseDetail?.userId ? (
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                h="30px"
                                flex={1}
                              >
                                <CartButton isRelease release={releaseDetail} />
                              </Flex>
                            ) : (
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                h="30px"
                                flex={1}
                              >
                                <Text
                                  fontSize="12px"
                                  fontWeight={700}
                                  textAlign="end"
                                >
                                  {formatMoney(releaseDetail?.price)}
                                </Text>
                              </Flex>
                            )}
                          </Box>
                        </Flex>
                      )}
                      {releaseDetail?._id && (
                        <Box
                          cursor="pointer"
                          onClick={() => handleShowAllTrack(itemsRef)}
                        >
                          <IoEyeSharp fontSize="20px" />
                        </Box>
                      )}
                    </Flex> */}
                  </Flex>
                  <Flex
                    bg="#e20000"
                    fontSize="12px"
                    fontWeight={700}
                    color="#fff"
                    justifyContent="space-between"
                    w="100%"
                    h="30px"
                  >
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="33%"
                      h="100%"
                      borderRight="1px solid #fff"
                    >
                      RETAIL
                    </Flex>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="33%"
                      h="100%"
                      borderRight="1px solid #fff"
                    >
                      TRACKS
                    </Flex>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="33%"
                      h="100%"
                    >
                      SALE
                    </Flex>
                  </Flex>
                  <Flex
                    fontSize="12px"
                    fontWeight={700}
                    justifyContent="space-between"
                    w="100%"
                    h="30px"
                  >
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="33%"
                      h="100%"
                      fontSize="12px"
                      fontWeight={700}
                      textDecoration="line-through double #e90000"
                    >
                      {formatMoney(releaseDetail?.savePrice)}
                    </Flex>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="33%"
                      h="100%"
                      fontSize="12px"
                      fontWeight={700}
                    >
                      {releaseDetail?.trackByRelease ?? 0}
                    </Flex>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="33%"
                      h="100%"
                    >
                      <Box className="cart">
                        {releaseDetail?.user?._id !== releaseDetail?.userId ? (
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            h="30px"
                            flex={1}
                          >
                            <CartButton isRelease release={releaseDetail} />
                          </Flex>
                        ) : (
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            h="30px"
                            flex={1}
                          >
                            <Text
                              fontSize="12px"
                              fontWeight={700}
                              textAlign="end"
                              color={!isDarkMode ? '#000' : '#fff'}
                            >
                              {formatMoney(releaseDetail.price)}
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </Flex>
                  </Flex>
                  {releaseDetail?._id && (
                    <Box
                      cursor="pointer"
                      onClick={() => handleShowAllTrack(itemsRef)}
                    >
                      <IoEyeSharp fontSize="20px" />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          {releaseDetail?._id && (
            <TracksAndPagination
              setFilter={setFilter}
              tracks={tracks}
              filter={filter}
              currentPage={currentPage}
              itemsRef={itemsRef}
              isShowAllTracks={isShowAllTracks}
              totalPage={totalPage}
              isLoading={isLoading}
              isShowExpandedAll={false}
              onHandleClickItemTagGenre={onHandleClickItemTagGenre}
            />
          )}
        </Box>
      </Flex>
    </>
  );
}
