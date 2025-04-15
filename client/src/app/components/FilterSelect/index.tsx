import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import IconRemoveOption from 'app/assets/svgs/IconRemoveOption';
import IconReturn from 'app/assets/svgs/IconReturn';
import { MEDIA_TYPE, SORT_TYPE } from 'app/constants/enum';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useSections } from 'app/hooks/sections/useSections';
import { useTracksKeys } from 'app/hooks/trackKeys/useTrackKeys';
import { Genre, Tag, Users } from 'app/models';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import SelectItem from '../Select';
import styles from './filterSelect.module.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { onlyShowNumber } from 'app/utils/onlyShowNumber';

interface Props {
  filterItems?: any;
  filter?: any;
  onFilter?: (event, key, type) => void;
  genres?: Genre[];
  tags?: Tag[];
  users?: Users[];
  onReset?: () => void;
  setFilter?: any;
  isShowPageTrack?: boolean;
  handleFilterBpmOrYear?: any;
  range?: any;
}

export default function FilterSelect({
  filterItems = [],
  filter,
  onFilter,
  genres,
  tags,
  users,
  onReset,
  setFilter,
  isShowPageTrack = false,
  handleFilterBpmOrYear,
  range,
}: Props) {
  const { sections } = useSections();
  const { trackKeys } = useTracksKeys();
  const { colorMode } = useColorMode();
  const { isLargerThan992, isLargerThan650 } = useMediaScreen();
  const { handleInputFocus, handleInputBlur } = usePlayers();

  const isShowListOptionSelected =
    (filter.showGenres && filter.showGenres.length > 0) ||
    (filter.showTags && filter.showTags.length > 0) ||
    (filter.showContributors && filter.showContributors.length > 0) ||
    (filter.showTrackKeys && filter.showTrackKeys.length > 0);

  const itemFilter = useMemo(() => {
    return [
      SORT_TYPE.SHOW_TAGS,
      SORT_TYPE.SHOW_GENRES,
      SORT_TYPE.SHOW_SUB_GENRES,
      SORT_TYPE.SHOW_CONTRIBUTORS,
      SORT_TYPE.SHOW_SECTIONS,
      SORT_TYPE.SHOW_TRACKKEYS,
    ];
  }, []);

  const handleCheckKey = (item, key) => {
    return item.includes(key);
  };

  const handleValue = useCallback(
    item => {
      return item.opions.filter(i => {
        if (filter && filter[item.name]) {
          // if (
          //   [
          //     // SORT_TYPE.SHOW_SECTIONS,
          //     // SORT_TYPE.SHOW_TRACKKEYS,
          //     // SORT_TYPE.SHOW_CONTRIBUTORS,
          //   ].includes(item.name)
          // ) {
          //   return i.value === filter[item.name].value;
          // }

          return filter[item.name].some(j => j.value === i.value);
        }
        return false;
      });
    },
    [filter],
  );

  const handleShowTag = useCallback(
    (filters, key, i) => {
      return (
        <Box>
          {/* <Text fontSize="12px" m="5px 5px 5px 0">
            {key === SORT_TYPE.SHOW_GENRES && 'Filter Genres'}
            {key === SORT_TYPE.SHOW_SUB_GENRES && 'Filter Sub Genres'}
            {key === SORT_TYPE.SHOW_TAGS && 'Filter Tags'}
            {key === SORT_TYPE.SHOW_TRACKKEYS && 'Filter Keys'}
            {key === SORT_TYPE.SHOW_CONTRIBUTORS && 'Filter Contributons'}
            {key === SORT_TYPE.SHOW_SECTIONS && 'Filter Labels'}
          </Text> */}
          <Flex className={styles.optionItem} key={i.value} alignItems="center">
            <IconRemoveOption
              onClick={() => {
                const data = filters[key]?.filter(item => item !== i);
                const newData = data.map(item => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                });
                onFilter && onFilter(newData, key, 'dropdown');
              }}
            />
            <Text fontSize="12px" ml="5px">
              {/* {key === SORT_TYPE.SHOW_SUB_GENRES && 'Sub Genres:'} */}
              {i?.subGenre && 'Sub Genres: '}
              {key === SORT_TYPE.SHOW_GENRES && !i?.subGenre && 'Genres:'}
              {key === SORT_TYPE.SHOW_TRACKKEYS && 'Keys:'}
              {key === SORT_TYPE.SHOW_CONTRIBUTORS && 'Contributors:'}
              {key === SORT_TYPE.SHOW_SECTIONS && 'Labels:'}
              {key === SORT_TYPE.SHOW_TAGS && 'Tags:'}
            </Text>
            <Text fontSize="12px" ml="5px">
              {i.label ||
                i.name ||
                i?.username ||
                (i?.musicKey === 'None'
                  ? 'None'
                  : `${i?.musicKey} / ${i?.camelotKey}`)}
            </Text>
          </Flex>
        </Box>
      );
    },
    [onFilter],
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
    (genres, tags, users) => {
      const showSections = (sections || []).filter(tag => {
        return (filter.showSections || []).some(item => {
          return tag._id === item.value;
        });
      });

      const showTrackKeys = (trackKeys || []).filter(tag => {
        return (filter.showTrackKeys || []).some(item => {
          return tag._id === item.value;
        });
      });

      const showContributors = (users || []).filter(tag => {
        return (filter.showContributors || []).some(item => {
          return tag._id === item.value;
        });
      });

      const showGenres = (genres || []).filter(gen => {
        return (filter.showGenres || []).some(item => {
          return gen._id === item.value;
        });
      });

      let subGenre = showGenres;
      if (showGenres.length === 2 && filter.typeFilter === 'all') {
        subGenre = showGenres.map((item, i) => {
          if (i === 1) {
            return { ...item, subGenre: true };
          }
          return item;
        });
      }
      // const showSubGenres = (genres || []).filter(gen => {
      //   return (filter.showSubGenres || []).some(item => {
      //     return gen._id === item.value;
      //   });
      // });

      const showTags = (tags || []).filter(tag => {
        return (filter.showTags || []).some(item => {
          return tag._id === item.value;
        });
      });

      const filters = {
        ...filter,
        showGenres: subGenre,
        showTags,
        // showSubGenres,
        showContributors,
        showSections,
        showTrackKeys,
      };

      return Object.keys(filters).map(function (key, index) {
        return handleShowSelected(filters, key);
      });
    },
    [filter, handleShowSelected, sections, trackKeys],
  );

  return (
    <Box w="100%" className={classNames((styles.lbHeader, styles[colorMode]))}>
      <Flex
        w="100%"
        gridGap="20px"
        flexWrap={{ base: 'wrap', md: 'wrap', lg: 'unset' }}
        justifyContent={{ base: 'end', sm: 'end', md: 'end', lg: 'unset' }}
        position="relative"
      >
        <SimpleGrid
          display={isShowPageTrack && isLargerThan992 ? 'flex' : 'grid'}
          w="100%"
          gridGap="6px"
          columns={1}
          padding="5px"
          border={`${isShowPageTrack ? 0 : 1}px solid #ebe3e3`}
          borderRadius="5px"
        >
          {filterItems.map((item, idx) => {
            return (
              <Box key={idx} w="100%">
                {item.name !== MEDIA_TYPE.CHECKBOX && (
                  <SelectItem
                    options={item.opions}
                    label={item.label}
                    name={item.name}
                    multi={item.multi}
                    onFilter={onFilter}
                    all={item.all}
                    value={handleValue(item)}
                  />
                )}
              </Box>
            );
          })}
        </SimpleGrid>
      </Flex>
      <Flex gridGap="10px" flexDirection={isLargerThan650 ? 'row' : 'column'}>
        <FormControl mb={2}>
          <FormLabel
            fontSize="12px"
            fontWeight={700}
            textDecoration="underline"
            my="4px"
          >
            Tempo range (0 - 220)
          </FormLabel>
          <Flex gridGap="10px">
            <Input
              borderRadius="6px"
              bg="#fff"
              w="100%"
              placeholder="From bpm"
              _placeholder={{ opacity: 1, color: '#000' }}
              color="#000"
              fontSize="14px"
              type="number"
              onChange={e =>
                handleFilterBpmOrYear('bpmStart', Number(e.target.value))
              }
              value={range?.bpmStart && Number(range?.bpmStart)}
              onKeyDown={e => onlyShowNumber(e)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            ></Input>
            <Input
              borderRadius="6px"
              bg="#fff"
              w="100%"
              placeholder="To bpm"
              _placeholder={{ opacity: 1, color: '#000' }}
              color="#000"
              fontSize="14px"
              onChange={e =>
                handleFilterBpmOrYear('bpmEnd', Number(e.target.value))
              }
              value={range?.bpmEnd && Number(range?.bpmEnd)}
              onKeyDown={e => onlyShowNumber(e)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            ></Input>
          </Flex>
        </FormControl>
        <FormControl mb={2}>
          <FormLabel
            fontSize="12px"
            fontWeight={700}
            textDecoration="underline"
            my="4px"
          >
            Release Year Range (1950 - {new Date().getFullYear()})
          </FormLabel>
          <Flex gridGap="10px">
            <Input
              borderRadius="6px"
              bg="#fff"
              w="100%"
              placeholder="From year"
              _placeholder={{ opacity: 1, color: '#000' }}
              color="#000"
              fontSize="14px"
              onChange={e =>
                handleFilterBpmOrYear('yearFrom', Number(e.target.value))
              }
              value={range?.yearFrom && Number(range?.yearFrom)}
              onKeyDown={e => onlyShowNumber(e)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            ></Input>

            <Input
              borderRadius="6px"
              bg="#fff"
              w="100%"
              placeholder="To year"
              _placeholder={{ opacity: 1, color: '#000' }}
              color="#000"
              fontSize="14px"
              onChange={e =>
                handleFilterBpmOrYear('yearTo', Number(e.target.value))
              }
              value={range?.yearTo && Number(range?.yearTo)}
              onKeyDown={e => onlyShowNumber(e)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            ></Input>
          </Flex>
        </FormControl>
      </Flex>
      {isShowListOptionSelected && (
        <Text fontSize="12px" m="15px 5px 5px 0" fontWeight={700}>
          Active Filters
        </Text>
      )}
      <Flex flexWrap="wrap">
        {renderListOptionSelected(genres, tags, users)}
      </Flex>
      {!isShowPageTrack && (
        <Flex
          position="absolute"
          bottom="16px"
          right="16px"
          cursor="pointer"
          onClick={onReset}
        >
          <IconReturn />
        </Flex>
      )}
    </Box>
  );
}
