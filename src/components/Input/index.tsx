import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

const Input: React.FC<TextFieldProps> = ({ name = '', type, ...rest }) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current?.lastChild?.firstChild,
      path: type === 'number' ? 'valueAsNumber' : 'value',
    });
  }, [fieldName, registerField, type]);

  return (
    <TextField
      ref={inputRef}
      name={name}
      type={type}
      error={!!error}
      helperText={error}
      defaultValue={defaultValue}
      {...rest}
    />
  );
};

export default Input;
