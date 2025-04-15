import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import styles from './styles.module.scss';

interface Props {
  genres: any;
  tags: any;
  handleChangeFilter?: any;
  isReleases?: boolean;
}

export default function FilterGenresTags({
  genres,
  tags,
  handleChangeFilter,
  isReleases = false,
}: Props) {
  const [arrayTickGenres, setArrayTickGenres] = useState<any>([]);
  const [arrayTickTag, setArrayTickTag] = useState<any>([]);
  const [isOnclick, setIsOnclick] = useState<boolean>(false);

  const renderGenreReleases = useCallback(
    content => {
      let arrBgs: any = arrayTickGenres || [];
      let arrBg = content.map(i => {
        let checkIndexs: number = arrBgs.findIndex(
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
        if (isReleases) {
          handleChangeFilter(arr, 'showGenres');
        } else handleChangeFilter(arr, 'showGenres', 'dropdown');
        setIsOnclick(!isOnclick);
      };

      return arrBg.map(item => {
        return (
          <Box
            className={styles.itemGenre}
            key={item?._id}
            onClick={() => handleArrayGenres(item)}
          >
            <Box
              className={styles.itemGenres}
              bg={item.bg}
              color={item.colorText}
            >
              {item?.name}
            </Box>
          </Box>
        );
      });
    },
    [arrayTickGenres, handleChangeFilter, isOnclick, isReleases],
  );

  const renderTagReleases = useCallback(
    content => {
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
        setIsOnclick(!isOnclick);
      };
      return arrBg.map(item => {
        return (
          <>
            <Box
              className={styles.itemsTag}
              key={item?._id}
              onClick={() => handleArrayTag(item)}
              w="auto"
            >
              <Box
                className={styles.itemsTags}
                bg={item.bg}
                color={item.colorText}
              >
                {item?.name}
              </Box>
            </Box>
          </>
        );
      });
    },
    [arrayTickTag, handleChangeFilter, isOnclick],
  );
  const colorFilter = useColorModeValue('black', 'white');

  return (
    <Flex w="full" flexDir="column" gridGap="5px" my="10px">
      {genres.length > 0 && (
        <Box color={colorFilter} fontSize="14px">
          select genres to filter the results:
        </Box>
      )}
      <Box
        pr="10px"
        w="full"
        cursor="pointer"
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
        gridGap="10px"
      >
        {renderGenreReleases(genres)}
      </Box>
      {tags.length > 0 && (
        <Box color={colorFilter} fontSize="14px">
          select tags to filter the results:
        </Box>
      )}
      <Box
        pr="10px"
        w="full"
        cursor="pointer"
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
        gridGap="10px"
      >
        {renderTagReleases(tags)}
      </Box>
    </Flex>
  );
}
