import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import DropDown from 'app/components/Common/Dropdowns';
import InputSearch from 'app/components/InputSearch';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useGeneral } from 'app/hooks/general/useGeneral';
import { selectReleaseDetail } from 'app/pages/ReleaseDetail/slice/selectors';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './styles.module.scss';

interface Props {
  useTracksHook?: any;
  itemsRef: React.MutableRefObject<any>;
}

export function SortReleaseDetail({ useTracksHook, itemsRef }: Props) {
  const { releaseDetail } = useSelector(selectReleaseDetail);

  const { searchValue, handleChangeFilter, handleChange, filter, setFilter } =
    useTracksHook;

  const { sortByTrackOptionsV1 } = useFilters();

  const { inputRef } = useGeneral();

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, releaseDetail?.trackByRelease);
  }, [itemsRef, releaseDetail?.trackByRelease]);

  useEffect(() => {
    if (releaseDetail?.boughtByMe) {
      setFilter(prev => ({
        ...prev,
        releaseSlug: slug,
      }));
    }
  }, [slug, releaseDetail?.boughtByMe, setFilter]);

  const bgSubFilter = useColorModeValue('#fff', '#1A1F2C');

  // const { isOnchangeInput } = useSelector(selectSliceInput);

  return (
    <Flex
      id="filter"
      ref={inputRef}
      flexDirection="row"
      alignItems="flex-end"
      mb="15px"
      pt="5px"
      justifyContent={{ base: 'space-between', md: 'unset' }}
      bg={bgSubFilter}
      display="block"
    >
      <Box mr="5px" mb="15px">
        <Text
          pb="3px"
          fontSize="10px"
          color={useColorModeValue('#333', '#fff')}
        >
          Sort by:
        </Text>
        <DropDown
          filters={sortByTrackOptionsV1}
          handleChangeDropDown={handleChangeFilter}
          name="sort"
          value={filter?.sort}
          height="40px"
          width="fit-content"
          border="1px solid #ccc !important"
        />
      </Box>
      <Box w="full">
        <Text
          color={useColorModeValue('#333', '#fff')}
          fontSize="10px"
          pb="3px"
        >
          artists, titles, etc..
        </Text>
        <Box position="relative" h="40px">
          <InputSearch
            isHideIcon
            value={searchValue}
            onChange={handleChange}
            placeholder="Search"
            height="40px"
            border="1px solid #ccc !important"
            className={styles.input}
          />
          {/* {!isOnchangeInput && (
            <Box
              cursor="pointer"
              position="absolute"
              right="10px"
              top="10px"
              ml="10px"
              _hover={{
                filter: 'invert(1)',
              }}
              onClick={() => handleShowAllTrack(itemsRef)}
            >
              {isShowAllTracks ? (
                <BsFillEyeSlashFill
                  className={styles.iconEye}
                  fontSize="30px"
                />
              ) : (
                <IoEyeSharp className={styles.iconEye} fontSize="30px" />
              )}
            </Box>
          )} */}
        </Box>
      </Box>
    </Flex>
  );
}
