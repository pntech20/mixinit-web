import { Checkbox, FormControl, Input, Textarea } from '@chakra-ui/react';
import { INPUT_TYPE } from 'app/constants/enum';
import classnames from 'classnames';
import { useCallback } from 'react';
import { Control, Controller } from 'react-hook-form';
import styles from './index.module.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';

export type InputType =
  | 'text'
  | 'password'
  | 'number'
  | 'select'
  | 'textarea'
  | 'checkbox';

interface TextInputProps {
  type: InputType;
  control: Control<any>;
  name: string;
  label?: string;
  errors?: any;
  placeholder?: string;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
  defaultValue?: string;
}

export default function TextInput({
  type = 'text',
  label,
  name,
  control,
  errors = {},
  className,
  placeholder,
  disabled,
  labelClassName,
  ...props
}: TextInputProps) {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const renderInputByType = useCallback(
    (type: InputType, field) => {
      if (type === INPUT_TYPE.TEXT_AREA) {
        return (
          <Textarea
            className={styles.formInputTextarea}
            defaultValue={field?.value}
            placeholder={placeholder}
            {...field}
            {...props}
            disabled={disabled}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        );
      }
      if (type === INPUT_TYPE.CHECK_BOX) {
        return (
          <Checkbox
            className={styles.formInput}
            defaultValue={field?.value}
            {...field}
            {...props}
          />
        );
      }
      return (
        <>
          <Input
            type={type}
            className={classnames(styles.formInput, className)}
            defaultValue={field?.value}
            {...field}
            {...props}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </>
      );
    },
    [
      className,
      props,
      placeholder,
      disabled,
      handleInputFocus,
      handleInputBlur,
    ],
  );

  return (
    <>
      {label && (
        <label className={classnames(styles.fromLabel, labelClassName)}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl
            name={name}
            className={classnames(styles.formItem, className)}
          >
            {renderInputByType(type, field)}
            {errors[name] && (
              <p style={{ color: 'red' }}>{errors[name].message}</p>
            )}
          </FormControl>
        )}
      />
    </>
  );
}
