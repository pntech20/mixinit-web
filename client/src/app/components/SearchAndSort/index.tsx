import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useBreakpointValue } from '@chakra-ui/react';
import DropDown from '../Common/Dropdowns';
import Search from './Search';
import SelectItem from '../Select';
import { useTranslation } from 'react-i18next';
import { IOption } from 'app/constants/interface';
import { useCallback, useMemo } from 'react';
import { useCommunity } from 'app/hooks/Community/useCommunity';

export default function SearchAndSort({
  placeHolder,
  handleChange,
  listSort,
  searchValue,
  valueSort,
  handleChangeFilter,
  mbSearch,
  handleFilterCheckbox,
  filter,
  isShowCheckboxs = false,
  isMultipacks = false,
}: {
  placeHolder: string;
  handleChange: any;
  listSort: any;
  searchValue: string;
  valueSort: any;
  handleChangeFilter: any;
  mbSearch?: any;
  handleFilterCheckbox?: any;
  filter?: any;
  isShowCheckboxs?: boolean;
  isMultipacks?: boolean;
}) {
  const { t } = useTranslation();
  const bgSubFilter = useColorModeValue('#fff', '#1A1F2C');
  const labelFilter = useColorModeValue('#616161', '#fff');
  const { isLargerThan600 } = useMediaScreen();
  const widthDropDown = useBreakpointValue({
    base: '100%',
    md: '132px',
    lg: '170px',
  });

  const { contributors: users } = useCommunity();

  const usersOptions: Array<IOption> = useMemo(() => {
    return ([...users] || [])
      .sort(function (a, b) {
        return a.username.localeCompare(b.username);
      })
      .map(user => {
        return { label: user.username, value: user._id };
      });
  }, [users]);

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

  const item = {
    title: 'Contributors',
    name: 'showContributors',
    opions: usersOptions,
    label: t('filter.selectContributor'),
    multi: true,
    all: 'Contributors',
  };

  return (
    <Flex
      flexDirection={isLargerThan600 ? 'row' : 'column-reverse'}
      gridGap="12px"
      justifyContent={{
        base: isMultipacks ? '' : 'space-between',
        md: 'space-between',
        xl: 'unset',
      }}
      bg={bgSubFilter}
      flexWrap={{ base: 'wrap', md: 'unset' }}
      w="100%"
    >
      <Flex gridGap="12px" alignItems="center">
        <Box w={{ base: '100%', md: 'unset' }}>
          <Text
            fontSize="12px"
            fontWeight="600"
            color={useColorModeValue('#616161', '#fff')}
          >
            Sort by:
          </Text>
          <DropDown
            width={widthDropDown}
            filters={listSort}
            handleChangeDropDown={handleChangeFilter}
            name="sort"
            value={valueSort}
          />
        </Box>
      </Flex>
      {isMultipacks && (
        <Flex gridGap="12px" alignItems="center">
          <Box w={{ base: '100%', md: '200px' }}>
            <Text
              fontSize="12px"
              fontWeight="600"
              color={labelFilter}
              mb="-2px"
            >
              Contributor:
            </Text>
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
          </Box>
        </Flex>
      )}
      <Search
        mb={mbSearch}
        searchValue={searchValue}
        placeHolder={placeHolder}
        handleChange={handleChange}
        filter={filter}
        handleFilterCheckbox={handleFilterCheckbox}
        isShowCheckboxs={isShowCheckboxs}
      />
    </Flex>
  );
}
