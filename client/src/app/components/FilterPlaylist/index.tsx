import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/react';
import IconRemoveOption from 'app/assets/svgs/IconRemoveOption';
import IconReturn from 'app/assets/svgs/IconReturn';

import { useColorModeValue } from '@chakra-ui/react';
import { MEDIA_TYPE, SORT_TYPE } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { Genre, PlaylistsFilter, Tag } from 'app/models';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useMemo } from 'react';
import CheckBoxRadio from '../ButtonFilterTrack/CheckBoxRadio';
import DropDown from '../Common/Dropdowns';
import InputSearch from '../InputSearch';
import SelectItem from '../Select';
import styles from './filterPlaylist.module.scss';

interface SearchFilterProps {
  handleChangeFilter: (data, key) => void;
  playlistFilter: PlaylistsFilter;
  onReset?: () => void;
  handleChange?: (e) => void;
  filter?: any;
  genres?: Genre[];
  tags?: Tag[];
  searchValue?: string;
}

const FilterPlaylist: FunctionComponent<SearchFilterProps> = ({
  handleChangeFilter,
  playlistFilter,
  searchValue = '',
  filter,
  onReset,
  handleChange,
  genres,
  tags,
}: SearchFilterProps) => {
  const { colorMode } = useColorMode();
  const { filtersPlayList, sortByOptions, timeFrameOptions } = useFilters();
  const releaseFilters = filtersPlayList.filter(
    item => item.name !== 'checkbox',
  );
  const sort = useCallback(items => {
    return [...items].sort((a, b) => {
      var nameA = a.label.toUpperCase();
      var nameB = b.label.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  }, []);

  const handleValue = useCallback(
    item => {
      return item.opions.filter(i => {
        if (playlistFilter && playlistFilter[item.name]) {
          if (['showSections', 'showContributors'].includes(item.name)) {
            return i.value === playlistFilter[item.name].value;
          }
          return playlistFilter[item.name].some(j => j.value === i.value);
        }
        return false;
      });
    },
    [playlistFilter],
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
        <Flex
          className={styles.optionItem}
          key={i.value}
          alignItems="center"
          mb="10px"
        >
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
        return (playlistFilter.showGenres || []).some(item => {
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
        return (playlistFilter.showTags || []).some(item => {
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
        ...playlistFilter,
        showGenres: newShowGenres,
        showTags: newShowTags,
      };

      return Object.keys(filters).map(function (key, index) {
        return handleShowSelected(filters, key);
      });
    },
    [playlistFilter, handleShowSelected],
  );

  const isActiveFilters =
    (playlistFilter.showGenres && playlistFilter.showGenres.length > 0) ||
    (playlistFilter.showTags && playlistFilter.showTags.length > 0) ||
    (playlistFilter.showSections && playlistFilter.showSections.length > 0);

  const renderSelect = () => {
    return (
      <SimpleGrid w="100%" gridGap="6px">
        {releaseFilters.map((item, idx) => (
          <Box key={idx}>
            {item.name !== MEDIA_TYPE.CHECKBOX && (
              <Box>
                {/* <SelectInput
                  options={sort(item.opions)}
                  isMulti={item.multi}
                  name={item.name}
                  classNamePrefix={styles.select}
                  onChange={e => {
                    handleChangeFilter(e, item.name);
                  }}
                  placeholder={item.all}
                  value={handleValue(item)}
                /> */}
                <SelectItem
                  options={sort(item.opions)}
                  name={item.name}
                  multi={item.multi}
                  all={item.all}
                  value={handleValue(item)}
                  onChange={e => {
                    handleChangeFilter(e, item.name);
                  }}
                  label={item.all}
                  isReleasePage
                />
              </Box>
            )}
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box
      alignItems="center"
      className={classNames((styles.lbHeader, styles[colorMode]))}
    >
      <Box flexDir="column">
        <Text
          color={useColorModeValue('#616161', '#fff')}
          fontSize="10px"
          fontWeight="600"
        >
          Search and filter the table to find exactly what you are looking for!
        </Text>
        <InputSearch
          value={searchValue}
          onChange={handleChange}
          placeholder="Search title of playlist"
        />
      </Box>
      <Flex justifyContent="space-between" mt="12px" mb="8px">
        <Box>
          <Text pb="2px" fontSize="10px">
            Sort by:
          </Text>
          {sortByOptions && (
            <DropDown
              name="sort"
              filters={sortByOptions}
              handleChangeDropDown={handleChangeFilter}
              value={filter?.userPlaylists}
              width="100%"
            />
          )}
        </Box>
        <Box>
          <Text pb="2px" fontSize="10px">
            Time frame:
          </Text>
          <DropDown
            filters={timeFrameOptions}
            handleChangeDropDown={handleChangeFilter}
            name="dateRange"
            value={filter?.dateRange}
          />
        </Box>
      </Flex>
      <Flex p="10px 0px" justifyContent="space-between">
        <Flex w="100%" flexWrap="wrap">
          <CheckBoxRadio
            onChangeFilter={handleChangeFilter}
            filter={playlistFilter}
          />
        </Flex>
      </Flex>
      <Box p="10px 0px">
        {renderSelect()}
        <Flex
          cursor="pointer"
          pt="20px"
          w="100%"
          justifyContent="end"
          onClick={onReset}
        >
          <IconReturn />
        </Flex>
        <Box mt="15px">
          {isActiveFilters && (
            <Text fontSize="12px" m="5px 5px 5px 0" fontWeight={700}>
              Active Filters
            </Text>
          )}
        </Box>
        <Flex flexWrap="wrap">{renderListOptionSelected(genres, tags)}</Flex>
      </Box>
    </Box>
  );
};

export default FilterPlaylist;
