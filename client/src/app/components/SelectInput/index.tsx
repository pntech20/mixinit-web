import { Flex } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import Select, { components } from 'react-select';
import './styles.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';

interface SelectInputProps {
  options?: any;
  placeholder?: any;
  onChange?: (e) => void;
  value?: any;
  selectInputRef?: any;
  isMulti?: boolean;
  formatOptionLabel?: any;
  name?: string;
  className?: string;
  classNamePrefix?: string;
  NoOptionsMessage?: any;
  defaultValue?: any;
  isDisable?: boolean;
  customComponent?: boolean;
  isColorInput?: boolean;
  isSearchable?: boolean;
}

const SelectInput = ({
  isSearchable = true,
  isColorInput = false,
  isDisable,
  options = [],
  placeholder,
  value,
  selectInputRef,
  isMulti = false,
  formatOptionLabel,
  name = '',
  onChange,
  className,
  classNamePrefix = '',
  defaultValue,
  customComponent = false,
  NoOptionsMessage = () => {
    return (
      <Text textAlign="center" fontSize="14px" fontWeight="600">
        No Options
      </Text>
    );
  },
}: SelectInputProps) => {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { isLightMode } = useModeTheme();

  const Option = props => (
    <div>
      <components.Option {...props}>
        <Flex alignItems="center">
          {isMulti && (
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

  const styles = () => {
    const setBgColor = !isLightMode ? '#1a202c' : '#000';
    const setBgColorFocused = isLightMode ? '#dbdbdb' : '#fff';
    return {
      placeholder: (baseStyles: any) => ({
        ...baseStyles,
        color: isLightMode ? '#1a202c' : '#fff',
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
        borderColor: state.isHover
          ? 'unset'
          : state.isFocused
          ? 'unset'
          : 'unset',
      }),
      singleValue: (baseStyles: any) => ({
        ...baseStyles,
        color: 'unset',
        fontSize: '12px',
        fontWeight: '600',
      }),
      menuList: (baseStyles: any) => ({
        ...baseStyles,
        width: '100%',
        maxHeight: '800px',
        position: 'absolute',
        border: '1px solid #cccccc',
        backgroundColor: '#000',
        color: '#fff',
      }),
      input: (baseStyles: any) => ({
        ...baseStyles,
        color: !isColorInput ? '#fff' : isLightMode ? '#000' : '#fff',
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
    };
  };

  return (
    <Select
      styles={styles()}
      // className={`react-select react-select-${colorMode} ${className}`}
      defaultValue={defaultValue}
      placeholder={placeholder}
      options={options}
      name={name}
      formatOptionLabel={formatOptionLabel}
      isMulti={isMulti}
      onChange={onChange}
      value={value}
      ref={selectInputRef}
      classNamePrefix={classNamePrefix}
      components={
        customComponent ? { NoOptionsMessage } : { Option, MultiValue }
      }
      hideSelectedOptions={false}
      closeMenuOnSelect={!isMulti}
      isDisabled={isDisable}
      controlShouldRenderValue={!isMulti}
      aria-hidden={true}
      isSearchable={isSearchable}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
    />
  );
};

export default SelectInput;
