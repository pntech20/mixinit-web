import { Box, Flex, Text } from '@chakra-ui/layout';
import DropDown from 'app/components/Common/Dropdowns';
import { FunctionComponent } from 'react';
import Search from '../SearchAndSort/Search';
import { useColorModeValue } from '@chakra-ui/react';

interface SearchFilterProps {
  handleChangeFilter?: any;
  filter?: any;
  onReset?: () => void;
  handleChange?: (e) => void;
  sortBy?: any;
  searchValue?: string;
}

const SearchFilter: FunctionComponent<SearchFilterProps> = ({
  handleChangeFilter,
  filter = {},
  sortBy,
  onReset,
  handleChange,
  searchValue = '',
}: SearchFilterProps) => {
  return (
    <Box>
      <Flex
        alignItems="center"
        display={{ base: 'block', md: 'flex' }}
        gridGap="10px"
        width="100%"
      >
        <Box mb={{ base: '10px', md: 'unset' }}>
          <Text
            fontSize="12px"
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue('#616161', '#fff')}
            fontWeight={600}
          >
            Sort by:
          </Text>
          {sortBy && (
            <DropDown
              name="sort"
              filters={sortBy}
              handleChangeDropDown={handleChangeFilter}
              value={filter?.sort}
              width="170px"
            />
          )}
        </Box>
        <Search
          searchValue={searchValue || ''}
          placeHolder="Search label name"
          handleChange={handleChange}
        />
      </Flex>
      {/* <Flex mt="20px" justifyContent="flex-end">
        <Box cursor="pointer" onClick={onReset}>
          <IconReturn />
        </Box>
      </Flex> */}
    </Box>
  );
};

export default SearchFilter;
