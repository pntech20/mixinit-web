import { Box, Flex, Img, Text, useColorModeValue } from '@chakra-ui/react';
import PlaceholderBgDefault from 'app/assets/placeholders/playlist-placeholder.svg';
import { Release } from 'app/models';

import {
  BG_COLOR_GENRES,
  BG_COLOR_TAGS,
  COLOR_GENRES,
  COLOR_TAGS,
} from 'app/constants';
import { useCallback, useState } from 'react';
import { SortReleaseDetail } from '../SortReleaseDetail';
import styles from './bannerRelease.module.scss';
import CartButton from '../CartButton';
import { formatMoney } from 'app/utils/currency';
import { formatDate } from 'utils/date';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';

interface BannerProps {
  release: Release;
  useReleasesHook?: any;
  useTracksHook?: any;
  itemsRef: React.MutableRefObject<any>;
}

export function BannerReleaseDetail({
  release,
  useReleasesHook,
  useTracksHook,
  itemsRef,
}: BannerProps) {
  const { artwork, trackByRelease, totalUnBuyTracks, genres, tags } = release;
  const { handleChangeFilter } = useTracksHook;
  const { isDarkMode } = useModeTheme();

  const [arrayTickGenres, setArrayTickGenres] = useState<any>([]);
  const [arrayTickTag, setArrayTickTag] = useState<any>([]);

  const renderGenre = useCallback(
    (content, bgColor, color, heading) => {
      let arrBg: any = arrayTickGenres || [];
      arrBg = content.map(i => {
        let checkIndexs: number = arrBg.findIndex(
          (a: any) => a.value === i._id,
        );

        return checkIndexs > -1
          ? { ...i, colorText: '#fff', bg: '#0073ff' }
          : { ...i, colorText: '#fff', bg: '#002a57' };
      });

      const handleArrayGenres = item => {
        let arr: any = arrayTickGenres;
        let obj: any = {
          value: item._id,
          label: item.name,
        };

        let checkIndex: number = arr.findIndex(
          (a: any) => a.value === item._id,
        );
        if (checkIndex > -1) {
          arr.splice(checkIndex, 1);
        } else {
          arr.push(obj);
        }
        setArrayTickGenres(arr);

        handleChangeFilter(arr, 'showGenres', 'dropdown');
      };

      return arrBg.map(item => {
        const isSelected = arrayTickGenres.some(
          selectedItem => selectedItem.value === item._id,
        );

        return (
          <Box
            className={styles.itemGenre}
            key={item?._id}
            onClick={() => handleArrayGenres(item)}
          >
            <Box
              padding="5px 10px"
              bg={isSelected ? '#0073ff' : '#294f79'}
              borderRadius="5px"
              fontWeight={600}
              color="#fff"
              fontSize="12px"
            >
              {item?.name?.toUpperCase()}
            </Box>
          </Box>
        );
      });
    },
    [arrayTickGenres, handleChangeFilter],
  );

  const renderTag = useCallback(
    (content, bgColor, color, heading) => {
      let arrBg: any = arrayTickTag || [];
      arrBg = content.map(i => {
        let checkIndexs: number = arrBg.findIndex(
          (a: any) => a.value === i._id,
        );

        return checkIndexs > -1
          ? { ...i, colorText: '#fff', bg: '#ff0000' }
          : { ...i, colorText: '#fff', bg: '#9b0000' };
      });
      const handleArrayTag = item => {
        let arr: any = arrayTickTag;
        let obj: any = {
          value: item._id,
          label: item.name,
        };

        let checkIndex: number = arr.findIndex(
          (a: any) => a.value === item._id,
        );
        if (checkIndex > -1) {
          arr.splice(checkIndex, 1);
        } else {
          arr.push(obj);
        }

        setArrayTickTag(arr);
        handleChangeFilter(arr, 'showTags', 'dropdown');
      };
      return arrBg.map(item => {
        const isSelected = arrayTickTag.some(
          selectedItem => selectedItem.value === item._id,
        );
        return (
          <>
            <Box
              className={styles.itemsTag}
              key={item?._id}
              onClick={() => handleArrayTag(item)}
              w="auto"
            >
              <Box
                padding="5px 10px"
                bg={isSelected ? '#ff0000' : '#9b0000'}
                borderRadius="5px"
                fontWeight={600}
                color="#fff"
                fontSize="12px"
              >
                {item?.name}
              </Box>
            </Box>
          </>
        );
      });
    },
    [arrayTickTag, handleChangeFilter],
  );

  return (
    <Flex
      className={styles.containerBannerDetail}
      bg={useColorModeValue('white', '')}
      display={{ md: 'grid', base: 'block' }}
    >
      <Img
        w="100%"
        borderRadius="5px"
        src={artwork}
        fallbacksrc={PlaceholderBgDefault}
      />

      <Box pt="10px">
        <Text fontWeight="700" fontSize="12px">
          {formatDate(release?.createdAt)}
        </Text>
        <Text
          fontSize="25px"
          fontWeight={700}
          lineHeight="35px"
          color={useColorModeValue('#333', '#fff')}
        >
          {release?.title}
        </Text>
        <Text
          fontSize="16px"
          lineHeight="22px"
          color={useColorModeValue('#333', '#fff')}
        >
          {release?.description}
        </Text>
      </Box>

      <Box w="full">
        {/* <Flex className="action-section" m="15px 0px" marginLeft="unset">
          <Box className="track">
            <Text fontWeight={800}>{release?.trackByRelease ?? 0} TRACKS </Text>
          </Box>
          <Box className="save">
            <Text>SAVE {formatMoney(release?.savePrice)}</Text>
          </Box>
          <Box className="cart">
            {release?.user?._id !== release?.userId ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                h="30px"
                flex={1}
              >
                <CartButton isRelease release={release} />
              </Flex>
            ) : (
              <Flex
                justifyContent="center"
                alignItems="center"
                h="30px"
                flex={1}
              >
                <Text fontSize="12px" fontWeight={700} textAlign="end">
                  {formatMoney(release?.price)}
                </Text>
              </Flex>
            )}
          </Box>
        </Flex> */}
        <Box p="10px 0">
          {' '}
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
            <Flex justifyContent="center" alignItems="center" w="33%" h="100%">
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
              {formatMoney(release?.savePrice)}
            </Flex>
            <Flex
              justifyContent="center"
              alignItems="center"
              w="33%"
              h="100%"
              fontSize="12px"
              fontWeight={700}
            >
              {release?.trackByRelease ?? 0}
            </Flex>
            <Flex justifyContent="center" alignItems="center" w="33%" h="100%">
              <Box className="cart">
                {release?.user?._id !== release?.userId ? (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    h="30px"
                    flex={1}
                  >
                    <CartButton isRelease release={release} />
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
                      {formatMoney(release.price)}
                    </Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </Flex>
        </Box>
        <SortReleaseDetail useTracksHook={useTracksHook} itemsRef={itemsRef} />

        <Flex pt="20px" w="full" flexDir="column" gridGap="5px">
          <Box
            color={useColorModeValue('#000', '#fff')}
            fontSize="14px"
            fontWeight={400}
            ml="5px"
            style={{ fontStyle: 'italic' }}
          >
            select genres to filter the results:
          </Box>
          <Box
            ml="5px"
            pr="10px"
            w="full"
            cursor="pointer"
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            gridGap="10px"
          >
            {renderGenre(genres, BG_COLOR_GENRES, COLOR_GENRES, 'genres')}
          </Box>
          <Box
            mt="20px"
            color={useColorModeValue('#000', '#fff')}
            fontSize="14px"
            fontWeight={400}
            ml="5px"
            style={{ fontStyle: 'italic' }}
          >
            select tags to filter the results:
          </Box>
          <Box
            ml="5px"
            pr="10px"
            w="full"
            cursor="pointer"
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            gridGap="10px"
          >
            {renderTag(tags, BG_COLOR_TAGS, COLOR_TAGS, 'tags')}
          </Box>
        </Flex>
        <Text
          mt="20px"
          fontSize="12px"
          style={{ fontStyle: 'italic' }}
          fontWeight={600}
        >
          Your Library already contains{' '}
          {trackByRelease - (totalUnBuyTracks || 0)} tracks in this multipack.
        </Text>
      </Box>
    </Flex>
  );
}
