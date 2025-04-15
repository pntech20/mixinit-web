import { Box, Flex, Switch, Text, useColorModeValue } from '@chakra-ui/react';
import {
  BPM_MAX,
  BPM_MIN,
  TOKEN_MAX,
  TOKEN_MIN,
  YEAR_MIN,
} from 'app/constants';
import { SORT_TYPE, TYPE_FILTER } from 'app/constants/enum';
import { useFilters } from 'app/hooks/filters/userFilters';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { TracksFilters } from 'app/pages/Tracks/slice/types';
import { useEffect, useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import DropDown from '../Common/Dropdowns';
import FilterCrate from '../FilterCrate';
import FilterItem from '../FilterItem';
import Search from '../SearchAndSort/Search';
import SliderFilter from '../SliderFilter';
import CheckBoxRadio from './CheckBoxRadio';

interface ButtonFilter {
  onChangeFilter: (event, key, type) => void;
  isTrackPage?: boolean;
  filter: any;
  onClear: () => void;
  handleRangeSlider: (key: number, value: number) => void;
  handleSaveCrate: (filter: TracksFilters) => void;
  handleShowAllTrack?: () => void;
  isMyMediaPage?: boolean;
  isShowExpandedAll?: boolean;
  setFilter?: any;
  searchValue?: string;
  handleChange?: any;
  isReleaseDetail?: boolean;
}

export default function ButtonFilterTrack({
  onChangeFilter,
  filter,
  onClear,
  handleRangeSlider,
  handleSaveCrate,
  handleShowAllTrack,
  isTrackPage,
  isMyMediaPage = false,
  isShowExpandedAll = true,
  setFilter,
  handleChange,
  searchValue,
  isReleaseDetail = false,
}: ButtonFilter) {
  const { filtersV1 } = useFilters();

  const [bpm, setBpm] = useState([filter.bpmFrom, filter.bpmTo]);
  const [year, setYear] = useState([filter.yearFrom, filter.yearTo]);
  const [price, setPrice] = useState([TOKEN_MIN, TOKEN_MAX]);

  useEffect(() => {
    setBpm([filter.bpmFrom, filter.bpmTo]);
    setYear([filter.yearFrom, filter.yearTo]);
    setPrice([filter.priceFrom, filter.priceTo]);
  }, [
    filter.bpmFrom,
    filter.bpmTo,
    filter.priceFrom,
    filter.priceTo,
    filter.yearFrom,
    filter.yearTo,
  ]);

  useEffect(() => {
    setPrice([TOKEN_MIN, TOKEN_MAX]);
  }, []);

  const { isLargerThan475 } = useMediaScreen();

  const { sortByTrackOptionsV1 } = useFilters();

  useEffect(() => {
    if (isReleaseDetail) {
      sortByTrackOptionsV1.unshift({
        label: 'Order',
        value: SORT_TYPE.INDEX_ASC,
      });
    }
  }, [isReleaseDetail, sortByTrackOptionsV1]);

  return (
    <>
      <Flex
        alignItems={{ base: 'flex-end', md: 'center' }}
        top="53px"
        justifyContent="space-between"
        className="button-filter-track"
        gridGap={{ base: '15px', lg: '20px' }}
      >
        <Box justifyContent="space-between" p="10px 0px" w="100%">
          <Search
            searchValue={searchValue || ''}
            placeHolder="Search title, artist of track"
            handleChange={handleChange}
          />
          <Flex
            pt="20px"
            w="100%"
            justifyContent={!isLargerThan475 ? 'space-between' : 'initial'}
            gridGap={{ base: '15px', lg: '20px' }}
            flexWrap="wrap"
            alignItems="center"
          >
            <Flex>
              <Box mr={{ base: '15px', md: '12px' }}>
                <Text
                  pb="1px"
                  fontSize="12px"
                  color={useColorModeValue('#616161', '#fff')}
                  fontWeight={600}
                >
                  Sort by:
                </Text>
                <DropDown
                  filters={sortByTrackOptionsV1}
                  handleChangeDropDown={onChangeFilter}
                  name="sort"
                  value={filter?.sort}
                  width="100%"
                />
              </Box>
            </Flex>

            <Box mt="7px">
              <CheckBoxRadio onChangeFilter={onChangeFilter} filter={filter} />
            </Box>

            <SliderFilter
              name="price"
              text="Cost ($):"
              min={TOKEN_MIN}
              max={TOKEN_MAX}
              limit={price}
              setLimit={setPrice}
              onChangeSlider={handleRangeSlider}
            />

            <SliderFilter
              name="year"
              text="Track year:"
              min={YEAR_MIN}
              max={new Date().getFullYear()}
              limit={year}
              setLimit={setYear}
              onChangeSlider={handleRangeSlider}
            />
            <SliderFilter
              name="bpm"
              text="Track BPM:"
              min={BPM_MIN}
              max={BPM_MAX}
              limit={bpm}
              setLimit={setBpm}
              onChangeSlider={handleRangeSlider}
            />
            <Box>
              <Flex alignItems="center" gridGap="7px">
                <Text fontSize="12px">Each</Text>
                <Switch
                  colorScheme="blue"
                  size="md"
                  isChecked={filter?.typeFilter === TYPE_FILTER.ALL}
                  onChange={e =>
                    onChangeFilter(
                      e.target.checked,
                      TYPE_FILTER.TYPE_QUERY_FILTER,
                      TYPE_FILTER.TYPE_QUERY_FILTER,
                    )
                  }
                />
                <Text fontSize="12px">All</Text>
              </Flex>
              <Text fontSize="11px" mt="5px">
                {filter?.typeFilter === TYPE_FILTER.ALL
                  ? 'Results must match all the settings'
                  : 'Results must match at least one setting'}
              </Text>
            </Box>
            <FilterItem
              filterItems={filtersV1}
              onFilter={onChangeFilter}
              onReset={onClear}
              filter={filter}
              setFilter={setFilter}
            />
            {isTrackPage && (
              <FilterCrate
                onClear={onClear}
                filter={filter}
                handleSaveCrate={handleSaveCrate}
              />
            )}
          </Flex>
        </Box>
        {isShowExpandedAll && (
          <Box cursor="pointer" onClick={handleShowAllTrack}>
            <AiOutlineEye fontSize="20px" />
          </Box>
        )}
      </Flex>
    </>
  );
}
