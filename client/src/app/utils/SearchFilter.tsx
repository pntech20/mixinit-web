import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Flex, Text } from '@chakra-ui/layout';
import DropDown from 'app/components/Common/Dropdowns';
import InputSearch from 'app/components/InputSearch';
import SelectInput from 'app/components/SelectInput';
import { MEDIA_TYPE } from 'app/constants/enum';
import React, { FunctionComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchFilterProps {
  title?: string;
  filters?: any;
  handleChangeFilter?: any;
  type?: string;
  filter?: any;
  onReset?: () => void;
  handleChange?: (e) => void;
  sortBy?: any;
  timeFrameOptions?: any;
}

const SearchFilter: FunctionComponent<SearchFilterProps> = ({
  title = '',
  filters,
  handleChangeFilter,
  type = '',
  filter = {},
  sortBy,
  timeFrameOptions,
  onReset,
  handleChange,
}: SearchFilterProps) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const releaseFilters = filters.filter(item => item.name !== 'checkbox');

  const sort = useCallback(items => {
    return [...items].sort((a, b) => {
      var nameA = a.label.toUpperCase();
      var nameB = b.label.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  }, []);

  return (
    <Box
      alignItems="center"
      display={{
        base: 'block',
        lg: 'flex',
      }}
      className={`lb-header ${colorMode}`}
    >
      <Flex
        mb={{ base: '10px', lg: '0' }}
        alignItems="center"
        justifyContent="space-between"
        width="calc(100% - 394px)"
      >
        <Text
          fontSize={{ base: '24px', sm: '36px', md: '36px' }}
          fontWeight="600"
          minW={{ base: '92px', sm: '150px', lg: '150px' }}
        >
          {title}
        </Text>
        <Flex gridGap={{ base: '10px', lg: '20px' }} marginRight="10px">
          {sortBy && (
            <DropDown
              name="sort"
              filters={sortBy}
              handleChangeDropDown={handleChangeFilter}
            />
          )}

          {/* {timeFrameOptions && (
            <DropDown
              name="dateRange"
              filters={timeFrameOptions}
              handleChangeDropDown={handleChangeFilter}
              indexSelect={timeFrameOptions?.length - 1 || 3}
            />
          )} */}
        </Flex>
        <InputSearch placeholder={t('search')} onChange={handleChange} />
      </Flex>

      <Flex
        className="lb-choose"
        alignItems="end"
        ml={{ lg: 'auto' }}
        gridGap="10px"
        minWidth="384px"
      >
        {releaseFilters.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.name !== MEDIA_TYPE.CHECKBOX && (
              <SelectInput
                options={sort(item.opions)}
                isMulti={item.multi}
                name={item.name}
                classNamePrefix="select"
                value={item.opions.filter(i => {
                  if (filter && filter[item.name]) {
                    if (item.name === 'showSections') {
                      return i.value === filter[item.name].value;
                    }
                    return filter[item.name].some(j => j.value === i.value);
                  }
                  return false;
                })}
                onChange={e => {
                  handleChangeFilter(e, item.name, 'dropdown');
                }}
                placeholder={item.all}
                isColorInput
              />
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
};

export default SearchFilter;
