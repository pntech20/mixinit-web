import { Select, Box } from '@chakra-ui/react';
import { IOption } from 'app/constants/interface';
import { FunctionComponent } from 'react';
import styles from './dropdown.module.scss';

interface DropDownProps {
  filters: IOption[];
  handleChangeDropDown: (value, name, type) => void;
  name?: string;
  width?: string;
  height?: string;
  value?: string | number;
  fontSize?: string;
  border?: string;
  color?: string;
}

const DropDown: FunctionComponent<DropDownProps> = ({
  filters,
  handleChangeDropDown,
  name,
  width = '136px',
  value,
  height,
  fontSize,
  border,
  color,
}) => {
  return (
    <Box className={styles.sWraper}>
      <Select
        border={border}
        w={width}
        height={height}
        onChange={e => {
          handleChangeDropDown(e.target.value, name, 'dropdown');
        }}
        value={value}
        fontSize={fontSize}
        color={color}
      >
        {filters.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default DropDown;
