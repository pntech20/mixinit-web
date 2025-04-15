import { Box, Flex } from '@chakra-ui/react';
import { IOption } from 'app/constants/interface';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import classNames from 'classnames';
import Select, { components } from 'react-select';
import styles from './select.module.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';

interface SelectItemProps {
  options?: IOption[];
  label?: string;
  name?: string;
  multi?: boolean;
  onFilter?: (event, key, type) => void;
  onChange?: any;
  fullWidth?: boolean;
  isQuickChart?: boolean;
  isReleasePage?: boolean;
  all?: string;
  value?: IOption;
}
const SelectItem = ({
  options = [],
  label = '',
  name = '',
  multi = false,
  onFilter = () => {},
  onChange,
  fullWidth = false,
  isQuickChart = false,
  all,
  value,
  isReleasePage,
}: SelectItemProps) => {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { isLightMode } = useModeTheme();

  const Option = props => (
    <div>
      <components.Option {...props}>
        <Flex alignItems="center">
          {multi && (
            <input
              style={{ marginRight: '10px' }}
              type="checkbox"
              checked={props.isSelected}
            />
          )}
          <label>{props.label}</label>
        </Flex>
      </components.Option>
    </div>
  );

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const stylesSelect = () => {
    const setBgColor = !isLightMode ? '#1a202c' : '#000';
    const setBgColorFocused = isLightMode ? '#dbdbdb' : '#fff';
    return {
      placeholder: (baseStyles: any) => ({
        ...baseStyles,
        color: isLightMode ? '#000' : '#fff',
        fontSize: '12px',
        fontWeight: '600',
      }),
      option: (baseStyles: any, state: any) => ({
        ...baseStyles,
        fontSize: '12px',
        fontWeight: '700',
        color: state.isFocused ? '#000' : '#fff',
        backgroundColor: state.isFocused ? setBgColorFocused : setBgColor,
      }),
      control: (baseStyles: any, state: any) => ({
        ...baseStyles,
        backgroundColor: 'unset',
        boxShadow: 'unset',
        borderColor: 'none',
      }),
      singleValue: (baseStyles: any) => ({
        ...baseStyles,
        color: isLightMode ? '#000' : '#fff',
        fontSize: '12px',
        fontWeight: '600',
      }),
      menuList: (baseStyles: any) => ({
        ...baseStyles,
        width: '100%',
        maxHeight: '300px',
        position: 'absolute',
        border: '1px solid #cccccc',
        backgroundColor: '#000',
        color: '#fff',
      }),
      input: (baseStyles: any) => ({
        ...baseStyles,
        color: isLightMode ? '#000' : '#fff',
        fontSize: '12px',
        fontWeight: '600',
        height: '30px',
        alignItems: 'center',
      }),
      menu: (baseStyles: any) => ({
        ...baseStyles,
        backgroundColor: setBgColor,
        border: '1px solid #cccccc',
        marginTop: '0px',
        zIndex: '15',
        fontSize: '12px',
        fontWeight: '600',
      }),
      indicatorSeparator: (baseStyles: any) => ({
        ...baseStyles,
        display: 'none',
      }),
      clearIndicator: (baseStyles: any) => ({
        ...baseStyles,
        display: 'none',
      }),
      dropdownIndicator: (baseStyles: any) => ({
        ...baseStyles,
        width: '30px',
      }),
      indicatorContainer: (baseStyles: any) => ({
        ...baseStyles,
        color: isLightMode ? '#000 !important' : '#fff !important',
      }),
    };
  };

  return (
    <Box
      fontSize={{ base: isQuickChart ? '14px' : '18px' }}
      className={classNames(styles.inputSelect, {
        [styles.fullWidth]: fullWidth,
      })}
      width="100%"
    >
      <Select
        styles={stylesSelect()}
        placeholder={label}
        options={options}
        name={name}
        isMulti={multi}
        onChange={e => {
          isReleasePage ? onChange(e, name) : onFilter(e, name, 'dropdown');
        }}
        value={value}
        components={{ Option, MultiValue }}
        hideSelectedOptions={false}
        closeMenuOnSelect={!multi}
        controlShouldRenderValue={!multi}
        aria-hidden={true}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </Box>
  );
};

export default SelectItem;
