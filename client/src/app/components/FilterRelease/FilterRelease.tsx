import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import IconRemoveOption from 'app/assets/svgs/IconRemoveOption';
import IconReturn from 'app/assets/svgs/IconReturn';
import { MEDIA_TYPE, SORT_TYPE } from 'app/constants/enum';
import { FiltersProps } from 'app/constants/interface';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { Genre, ReleasesFilter, Tag } from 'app/models';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useMemo } from 'react';
import DropDown from '../Common/Dropdowns';
import Search from '../SearchAndSort/Search';
import SelectItem from '../Select';
import styles from './index.module.scss';

interface SearchFilterProps {
  filters: FiltersProps[];
  handleChangeFilter: (data, key) => void;
  filter: ReleasesFilter;
  onReset?: () => void;
  handleChange?: (e) => void;
  handleChangeCheckbox?: any;
  genres?: Genre[];
  tags?: Tag[];
  searchValue?: string;
  isShowPageRelease?: boolean;
}

const FilterRelease: FunctionComponent<SearchFilterProps> = ({
  filters,
  handleChangeFilter,
  searchValue = '',
  filter,
  onReset,
  handleChange,
  genres,
  tags,
  isShowPageRelease = false,
}: SearchFilterProps) => {
  const { colorMode } = useColorMode();
  const { isLargerThan992 } = useMediaScreen();

  const releaseFilters = filters.filter(item => item.name !== 'checkbox');
  const { sortByOptions } = useFilters();

  // const sort = useCallback(items => {
  //   return [...items].sort((a, b) => {
  //     var nameA = a.label.toUpperCase();
  //     var nameB = b.label.toUpperCase();
  //     return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  //   });
  // }, []);

  const handleValue = useCallback(
    item => {
      return item.opions.filter(i => {
        if (filter && filter[item.name]) {
          return filter[item.name].some(j => j.value === i.value);
        }
        return false;
      });
    },
    [filter],
  );

  const itemFilter = useMemo(() => {
    return [
      SORT_TYPE.SHOW_TAGS,
      SORT_TYPE.SHOW_GENRES,
      SORT_TYPE.SHOW_SECTIONS,
      SORT_TYPE.SHOW_CONTRIBUTORS,
    ];
  }, []);

  const handleCheckKey = (item, key) => {
    return item.includes(key);
  };

  const handleShowTag = useCallback(
    (filters, key, i) => {
      return (
        <Flex className={styles.optionItem} key={i.value} alignItems="center">
          <IconRemoveOption
            onClick={() => {
              const data = filters[key]?.filter(item => item !== i);
              const newData = data.map(item => {
                return {
                  label: item.label || item.name,
                  value: item.value || item._id,
                };
              });
              handleChangeFilter && handleChangeFilter(newData, key);
            }}
          />
          {key === 'showContributors' ? (
            <Text fontSize="12px" ml="5px">
              Contributons:{' '}
            </Text>
          ) : (
            key === 'showSections' && (
              <Text fontSize="12px" ml="5px">
                Labels:{' '}
              </Text>
            )
          )}
          <Text fontSize="12px" ml="5px">
            {i.label || i.name}
          </Text>
        </Flex>
      );
    },
    [handleChangeFilter],
  );

  const handleShowSelected = useCallback(
    (filters, key) => {
      return handleCheckKey(itemFilter, key)
        ? filters[key]?.length > 0 &&
            filters[key].map(i => handleShowTag(filters, key, i))
        : '';
    },
    [handleShowTag, itemFilter],
  );

  const renderListOptionSelected = useCallback(
    (genres, tags) => {
      const showGenres = (genres || []).filter(genre => {
        return (filter.showGenres || []).some(item => {
          return genre._id === item.value;
        });
      });
      const newShowGenres = showGenres.map(item => {
        return {
          ...item,
          label: item?.name,
          value: item._id,
        };
      });
      const showTags = (tags || []).filter(tag => {
        return (filter.showTags || []).some(item => {
          return tag._id === item.value;
        });
      });

      const newShowTags = showTags.map(item => {
        return {
          ...item,
          label: item?.name,
          value: item._id,
        };
      });

      const filters = {
        ...filter,
        showGenres: newShowGenres,
        showTags: newShowTags,
      };

      return Object.keys(filters).map(function (key, index) {
        return handleShowSelected(filters, key);
      });
    },
    [filter, handleShowSelected],
  );

  const isShowListOptionSelected =
    (filter.showGenres && filter.showGenres.length > 0) ||
    (filter.showTags && filter.showTags.length > 0) ||
    (filter.showContributors && filter.showContributors.length > 0) ||
    (filter.showSections && filter.showSections.length > 0);

  const isActiveFilters = isShowListOptionSelected;

  return (
    <Box
      alignItems="center"
      className={classNames((styles.lbHeader, styles[colorMode]))}
      w="100%"
    >
      {!isShowPageRelease && (
        <Search
          searchValue={searchValue || ''}
          placeHolder="Search title, artist of tracks inside multipack"
          handleChange={handleChange}
        />
      )}
      {!isShowPageRelease && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt="16px"
          mb="8px"
        >
          <Box>
            <Text
              pb="2px"
              fontSize="12px"
              // eslint-disable-next-line react-hooks/rules-of-hooks
              color={useColorModeValue('#616161', '#fff')}
              fontWeight={600}
            >
              Sort by:
            </Text>
            {sortByOptions && (
              <DropDown
                name="sort"
                filters={sortByOptions}
                handleChangeDropDown={handleChangeFilter}
                value={filter?.sort}
                width="100%"
              />
            )}
          </Box>
          {/* <Box>
          <Text pb="2px" fontSize="10px">
            Time frame:
          </Text>
          {timeFrameOptions && (
            <DropDown
              name="dateRange"
              filters={timeFrameOptions}
              handleChangeDropDown={handleChangeFilter}
              value={filter?.dateRange}
            />
          )}
        </Box> */}
        </Flex>
      )}

      {/* <Flex p="10px 0px" flexWrap="wrap-reverse" justifyContent="space-between">
        <Flex
          w="100%"
          justifyContent={!isLargerThan475 ? 'space-between' : 'initial'}
          gridGap={{ base: '15px', lg: '20px' }}
          flexWrap="wrap"
        >
          <CheckBoxRadio
            onChangeFilter={handleChangeCheckbox}
            filter={filter}
            isFilterRelease
          />
        </Flex>
      </Flex> */}
      <Box w="100%">
        <Flex
          pt="10px"
          gridGap="20px"
          flexWrap="wrap"
          position="relative"
          w="100%"
        >
          <SimpleGrid
            border={`${isShowPageRelease ? 0 : 1}px solid #ebe3e3`}
            borderRadius="5px"
            w="100%"
            gridGap="6px"
            columns={1}
            display={isShowPageRelease && isLargerThan992 ? 'flex' : 'grid'}
          >
            {releaseFilters.map((item, idx) => (
              <Box key={idx} w="100%">
                {item.name !== MEDIA_TYPE.CHECKBOX && (
                  <SelectItem
                    options={item.opions}
                    label={item.label}
                    name={item.name}
                    multi={item.multi}
                    all={item.all}
                    value={handleValue(item)}
                    onChange={e => {
                      handleChangeFilter(e, item.name);
                    }}
                    isReleasePage
                  />
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
        <Box mt="15px">
          {isActiveFilters && (
            <Text fontSize="12px" m="5px 5px 5px 0" fontWeight={700}>
              Active Filters
            </Text>
          )}
        </Box>
        <Flex flexWrap="wrap">{renderListOptionSelected(genres, tags)}</Flex>
        {!isShowPageRelease && (
          <Flex
            cursor="pointer"
            position="absolute"
            bottom="16px"
            right="16px"
            onClick={onReset}
          >
            <IconReturn />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default FilterRelease;
