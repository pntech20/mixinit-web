import { useColorMode } from '@chakra-ui/color-mode';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import './styles.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';

interface InputProps {
  placeholder?: any;
  className?: string;
  onChange?: (value) => void;
  onClick?: (value) => void;
}

export default function Search({
  placeholder = '',
  className = '',
  onChange,
  onClick,
}: InputProps) {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { colorMode } = useColorMode();

  return (
    <InputGroup className={`search-follower search-follower-${colorMode}`}>
      <InputLeftElement
        pointerEvents="none"
        children={<BiSearch width="15px" />}
      />

      <Input
        type="tel"
        placeholder={placeholder}
        className={`w-input ${className}`}
        onChange={onChange}
        onClick={onClick}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </InputGroup>
  );
}
