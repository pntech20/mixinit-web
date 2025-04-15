import { Box, Select } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import styles from './dropdownsLabel.module.scss';

interface DropDownProps {
  filters?: any;
  name: string;
  indexSelect?: number;
  handleChangevalue?: (value: string, key: string) => void;
}

const DropdownsLabel: FunctionComponent<DropDownProps> = ({
  filters,
  name,
  indexSelect = 0,
  handleChangevalue = (value, key) => {},
}) => {
  return (
    <Box w="100%" className={styles.wraper}>
      <Select
        h="40px"
        onChange={e => {
          handleChangevalue(e.target.value, name);
        }}
      >
        {filters.map((item, index) => (
          <option
            key={index}
            value={item.value}
            selected={index === indexSelect}
          >
            {item.label}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default DropdownsLabel;
