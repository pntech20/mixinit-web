import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import CommunityItem from 'app/components/Community';
import Empty from 'app/components/Empty';
import SearchAndSort from 'app/components/SearchAndSort';
import SkeletonItem from 'app/components/SkeletonItem';
import { generateArray } from 'app/helpers/functions';
import { useCommunity } from 'app/hooks/Community/useCommunity';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useCallback, useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import DropDown from 'app/components/Common/Dropdowns';
import { useSections } from 'app/hooks/sections/useSections';
import Pagination from 'app/components/Pagination';
import { useHistory } from 'react-router-dom';

interface ContributorsInLabelProps {
  labelId: string;
  labelDetail?: any;
}

export function ContributorsInLabel({
  labelId,
  labelDetail,
}: ContributorsInLabelProps) {
  const {
    onGetCommunity,
    handleChange,
    handleChangeFilter,
    setFilter,
    users,
    isLoading,
    searchValue,
    filter,
    totalPage,
  } = useCommunity();

  const history = useHistory();
  const { listOptionsSortByCommunity } = useFilters();

  const { sections } = useSections();

  const sectionsOptions = useMemo(() => {
    return ([...sections] || [])
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(section => {
        return { label: section.name, value: String(section?._id) };
      });
  }, [sections]);

  useEffect(() => {
    onGetCommunity();
  }, [onGetCommunity]);

  useEffect(() => {
    if (labelDetail?._id) {
      setFilter(prev => ({
        ...prev,
        labelId: labelDetail?._id,
      }));
    }
  }, [labelDetail?._id, setFilter]);

  const renderContent = useCallback(() => {
    return (
      <Box mt="20px">
        <SimpleGrid
          gridGap="10px"
          rowGap="15px"
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
        >
          {isLoading
            ? generateArray(4).map(item => (
                <SkeletonItem
                  className={styles.loadingContributor}
                  height="100%"
                  key={item}
                />
              ))
            : users.map((item, idx) => (
                <CommunityItem
                  key={item._id}
                  user={item}
                  labelId={labelDetail?._id}
                />
              ))}
        </SimpleGrid>
        {!isLoading && users.length === 0 && <Empty />}
      </Box>
    );
  }, [isLoading, labelDetail?._id, users]);

  return (
    <Box>
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
            CONTRIBUTORS
          </Text>
        </Box>
      </Flex>
      <Flex
        alignContent="center"
        alignItems="center"
        gridGap="12px"
        flexWrap={{ base: 'wrap', md: 'unset' }}
      >
        <Flex gridGap="12px" alignItems="center">
          <Box>
            <Text
              fontSize="12px"
              fontWeight="600"
              color={useColorModeValue('#616161', '#fff')}
            >
              Label:
            </Text>
            <DropDown
              width="170px"
              filters={sectionsOptions}
              value={filter.labelId}
              handleChangeDropDown={
                value => {
                  const section = sections.find(
                    section => section._id === value,
                  );
                  return history.push(`/labels/${section?.slug}?tab=3`);
                }
                // handleChangeFilter(value, 'labelId')
              }
            />
          </Box>
        </Flex>
        <SearchAndSort
          listSort={listOptionsSortByCommunity}
          searchValue={searchValue}
          handleChange={handleChange}
          valueSort={filter?.sort}
          handleChangeFilter={handleChangeFilter}
          placeHolder={'Search username of contributor'}
        />
      </Flex>

      {renderContent()}
      <Pagination totalPage={totalPage} setFilter={setFilter} />
    </Box>
  );
}
