import { Box, Flex } from '@chakra-ui/react';
import { getLabelDetail } from 'app/apis/sections/sections';
import { HelmetPage } from 'app/components/HelmetPage';
import Top10Contributors from 'app/components/Top10Contributors';
import Top10Genres from 'app/components/Top10Genres';
import Top10Tags from 'app/components/Top10Tags';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useTracks } from 'app/hooks/tracks/useTracks';
import classNames from 'classnames';
import { default as queryString } from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styles from './bannerLabel.module.scss';
import { TabContent } from './TabContents/TabContents';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';

export function LabelDetailPage() {
  // const { getAllLabels, allLabels } = useSections();
  const tracksHook = useTracks();
  const { handleChangeFilter, setIsShowFilterTrack } = tracksHook;
  const [labelDetail, setLabelDetail] = useState<any>(null);
  const { search } = useLocation();
  const [tabIndex, setTabIndex] = useState(1);
  const { isLargerThan522, isLargerThan992 } = useMediaScreen();

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const query = queryString.parse(search);
    if (query && query.tab) {
      setTabIndex(+query.tab);
    }
  }, [search]);

  // useEffect(() => {
  //   getAllLabels();
  // }, [getAllLabels]);

  const onGetLabelId = useCallback(async () => {
    const res = await getLabelDetail({ labelId: id });
    setLabelDetail(res);
  }, [id]);

  useEffect(() => {
    onGetLabelId();
  }, [onGetLabelId]);

  const listTabs = [
    {
      _id: 1,
      text: 'TRACKS:',
      content: labelDetail?.numberTracks,
    },
    {
      _id: 2,
      text: 'MULTIPACKS:',
      content: labelDetail?.numberReleases,
    },
    {
      _id: 3,
      text: 'CONTRIBUTORS:',
      content: labelDetail?.numberContributors,
    },
    {
      _id: 0,
      text: 'ABOUT',
      content: '',
    },
  ];

  const renderListTab = () => {
    return (
      <Flex direction={isLargerThan522 ? 'row' : 'column'} my="15px">
        {listTabs.map(item => (
          <Flex
            key={item._id}
            onClick={() => {
              setTabIndex(item?._id);
              history.push({
                pathname: `/labels/${labelDetail?.slug}`,
                search: `?tab=${item?._id}`,
              });
            }}
            className={classNames(
              styles.informationBanner,
              tabIndex === item._id && styles.informationBannerHover,
            )}
          >
            <Flex className={classNames(styles.text)}>
              {item.text} {item.content}
            </Flex>
          </Flex>
        ))}
      </Flex>
    );
  };

  // const listLabels = useMemo(() => {
  //   return allLabels?.filter(label => label?.slug !== id);
  // }, [allLabels, id]);

  return (
    <>
      <HelmetPage title="Labels" />
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
      {/* <Box
        className={styles.containerBannerLabel}
        backgroundColor={labelDetail?.labelBgColor || '#000'}
      >
        <Box className={styles.innerBannerLabel}>
          <Flex
            className={styles.listLabelsBanner}
            pl={{ base: '120px', sm: '132px', md: '13.5%' }}
          >
            {listLabels?.map((label: Section) => (
              <Box
                key={label?._id}
                className={styles.listItem}
                w={{ base: '72px', lg: '100px' }}
                h={{ base: '72px', lg: '100px' }}
              >
                <Image
                  objectFit="cover"
                  className={styles.listItemImage}
                  onClick={() => {
                    history.push(`/labels/${label?.slug}?tab=1`);
                    window.location.reload();
                  }}
                  src={label?.squareImageUrl}
                />
              </Box>
            ))}
          </Flex>
        </Box>
        {labelDetail && (
          <Image
            className={styles.bannerImageLabel}
            src={labelDetail.squareImageUrl}
          />
        )}
      </Box> */}
      <Flex display={{ base: 'block', md: 'flex' }}>
        <Box w={{ md: 'calc(100% - 240px)', base: '100%' }} mr="10px">
          {renderListTab()}
          <TabContent
            id={id}
            tabIndex={tabIndex}
            labelDetail={labelDetail}
            tracksHook={tracksHook}
          />
        </Box>
        {labelDetail && (
          <Box w={{ md: '250px', base: '100%' }}>
            <Top10Contributors
              labelName={labelDetail?.name}
              labelId={labelDetail?._id}
              handleChangeFilter={handleChangeFilter}
              setIsShowFilterTrack={setIsShowFilterTrack}
              setTabIndex={setTabIndex}
              labelDetail={labelDetail}
            />
            <Box mt="15px">
              <Top10Genres
                labelName={labelDetail?.name}
                labelId={labelDetail?._id}
                handleChangeFilter={handleChangeFilter}
                setIsShowFilterTrack={setIsShowFilterTrack}
              />
            </Box>
            <Box mt="15px">
              <Top10Tags
                labelName={labelDetail?.name}
                labelId={labelDetail?._id}
                handleChangeFilter={handleChangeFilter}
                setIsShowFilterTrack={setIsShowFilterTrack}
              />
            </Box>
          </Box>
        )}
      </Flex>
    </>
  );
}
