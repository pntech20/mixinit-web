import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/input';
import { BiSearch } from 'react-icons/bi';
import styles from './search.module.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { CircularProgress } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useInputSlice } from './slice';
import { selectSliceInput } from './slice/selectors';

interface InputSearchProps {
  onChange?: (e) => void;
  placeholder?: string;
  value?: string;
  isHideIcon?: boolean;
  height?: string;
  fontSize?: string;
  className?: string;
  border?: string;
  _placeholderFontSize?: string;
}

export default function InputSearch(props: InputSearchProps) {
  const {
    onChange,
    placeholder,
    value,
    isHideIcon,
    height,
    fontSize,
    _placeholderFontSize,
    className,
    border,
  } = props;
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { actions } = useInputSlice();
  const { isOnchangeInput } = useSelector(selectSliceInput);

  const { handleInputFocus, handleInputBlur } = usePlayers();

  const isNotUseInputRigh = useMemo(() => {
    const array = ['/home'];
    return array.includes(pathname);
  }, [pathname]);

  const onchangeInput = e => {
    onChange && onChange(e);
    !isNotUseInputRigh && dispatch(actions.setIsOnchangeInput(true));
  };

  return (
    <InputGroup className={styles.inputSearchContainer}>
      {!isHideIcon && (
        <InputLeftElement
          alignItems="center"
          h="100%"
          mt="1px"
          pointerEvents="none"
          children={<BiSearch color="gray.300" />}
        />
      )}
      <Input
        className={className}
        border={border}
        type="text"
        size="sm"
        h={height || '40px'}
        placeholder={placeholder ?? 'Search...'}
        onChange={e => onchangeInput(e)}
        value={value}
        fontSize={fontSize}
        _placeholder={{ fontSize: _placeholderFontSize, color: '#d4d4d4' }}
        _dark={{ _placeholder: { color: '#d4d4d4' } }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      {isOnchangeInput && !isNotUseInputRigh && (
        <InputRightElement
          alignItems="center"
          h="100%"
          pointerEvents="none"
          children={
            <CircularProgress size="25px" isIndeterminate color="green" />
          }
        />
      )}
    </InputGroup>
  );
}
