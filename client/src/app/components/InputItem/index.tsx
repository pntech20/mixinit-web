import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { Controller } from 'react-hook-form';

interface InputItemProps {
  placeholder?: string;
  className?: string;
  control?: any;
  type?: string;
  label?: string;
  name?: string;
  value?: string;
  errors?: any;
  disabled?: boolean;
}

export const InputItem = ({
  placeholder = '',
  className = '',
  control,
  label = '',
  name = '',
  type = '',
  value = '',
  disabled = false,
  errors = {},
  ...props
}: InputItemProps) => {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  return (
    <FormControl id={name} className={className} isInvalid={!!errors.message}>
      <FormLabel fontSize="16px" fontWeight="600" lineHeight="17.5px">
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        {...props}
        render={({ field }) => (
          <>
            <Input
              border="0.5px solid #AFAFAF"
              mb={3}
              type={type}
              placeholder={placeholder}
              _dark={{ _placeholder: { color: '#d4d4d4' } }}
              defaultValue={value}
              disabled={disabled}
              {...field}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>{errors.message}</FormErrorMessage>
          </>
        )}
      />
    </FormControl>
  );
};
