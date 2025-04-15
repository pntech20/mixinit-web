import { Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import IconReturn from 'app/assets/svgs/IconReturn';
import FilterRelease from 'app/components/FilterRelease/FilterRelease';
import { ReleasesAndPagination } from 'app/components/ReleasesAndPagination';
import SearchAndSort from 'app/components/SearchAndSort';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useGenres } from 'app/hooks/genres/useGenres';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTags } from 'app/hooks/tags/useTags';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import styles from './styles.module.scss';

interface Props {
  labelDetail?: any;
}

const ReleasesInLabel = ({ labelDetail }: Props) => {
  const {
    onGetReleases,
    handleChangeFilter,
    handleChange,
    onResetFilter,
    filter,
    handleChangeCheckbox,
    isLoadingRelease,
    releases = [],
    searchValue,
    isLoading,
    totalPage,
    currentPage,
    setFilter,
    isShowFilterRelease,
    setIsShowFilterRelease,
  } = useReleases();

  const { removeToggleShowFilter } = useTracks();
  const { isLargerThan839 } = useMediaScreen();
  const { filtersReleases, sortByOptions } = useFilters();

  useEffect(() => {
    onGetReleases();
  }, [onGetReleases, isLoadingRelease]);

  const { genres } = useGenres();
  const { tags } = useTags();

  useEffect(() => {
    return () => {
      removeToggleShowFilter();
    };
  }, [removeToggleShowFilter]);

  return (
    <>
      <Flex alignItems="center" gridGap="15px" mb="10px">
        <Image
          objectFit="cover"
          className={styles.listItemImage}
          src={labelDetail?.squareImageUrl}
        />
        <Box>
          {labelDetail?.name ? (
            <Text
              style={{
                fontFamily:
                  'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, sans-serif',
              }}
              className={styles.content}
            >
              {labelDetail?.name}
            </Text>
          ) : (
            <Skeleton w="200px" h="32px" />
          )}
          <Text
            style={{
              fontFamily: 'Exo, sans-serif',
            }}
            fontWeight={600}
          >
            MUTIPACKS
          </Text>
        </Box>
      </Flex>
      <Flex gridGap="8px" direction={{ base: 'column', md: 'row' }} mb="20px">
        <SearchAndSort
          listSort={sortByOptions}
          searchValue={searchValue}
          handleChange={handleChange}
          valueSort={filter?.sort}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search title, artist of tracks inside multipack'}
          mbSearch={{ md: isLargerThan839 ? '0px' : '18px' }}
        />
        <Flex
          mt={{
            base: '8px',
            md: isLargerThan839 ? '25px' : '46px',
            lg: '25px',
          }}
          mx={{ base: 'auto', md: 'unset' }}
          cursor="pointer"
          onClick={() => setIsShowFilterRelease(!isShowFilterRelease)}
        >
          <FaFilter fontSize="20px" />
        </Flex>
      </Flex>

      {isShowFilterRelease && (
        <>
          <Flex>
            <FilterRelease
              handleChange={handleChange}
              handleChangeFilter={handleChangeFilter}
              handleChangeCheckbox={handleChangeCheckbox}
              filters={filtersReleases}
              onReset={onResetFilter}
              filter={filter}
              genres={genres}
              tags={tags}
              searchValue={searchValue}
              isShowPageRelease
            />
          </Flex>
          <Flex
            justify="flex-end"
            alignItems="center"
            mb="8px"
            style={{ gap: '15px' }}
          >
            {isShowFilterRelease && (
              <Flex cursor="pointer" onClick={onResetFilter}>
                <IconReturn />
              </Flex>
            )}
          </Flex>
        </>
      )}
      <ReleasesAndPagination
        setFilter={setFilter}
        releases={releases}
        filter={filter}
        currentPage={currentPage}
        totalPage={totalPage}
        isLoading={isLoading}
      />
    </>
  );
};

export default ReleasesInLabel;
