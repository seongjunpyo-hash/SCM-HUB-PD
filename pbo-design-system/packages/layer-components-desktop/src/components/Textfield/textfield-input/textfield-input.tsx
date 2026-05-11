import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { useTextfieldContext } from '../_context/textfield-context';

import { clearButtonStyle, eyeButtonStyle, textfieldInputStyle } from './textfield-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ChangeEvent, WheelEvent } from 'react';
import type { TextfieldInputProps } from './textfield-input.types';

const DEFAULT_TYPE: TextfieldInputProps['type'] = 'text';

const TextfieldInput = forwardRef<HTMLInputElement, TextfieldInputProps>(
  ({ type = DEFAULT_TYPE, onValueChange, onClear, ...htmlInputProps }, ref) => {
    const { className, onChange, value, maxLength, ...restHtmlInputProps } = htmlInputProps;

    const { validationState, setInputState } = useTextfieldContext();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const handleClear = () => {
      onClear?.();
      inputRef.current!.value = '';
      inputRef.current?.focus();
    };

    const isError = validationState === 'error';

    const isPasswordType = type === 'password';
    const isNumberType = type === 'number';
    const inputType = isPasswordType ? (isPasswordVisible ? 'text' : 'password') : type;

    useEffect(() => {
      setInputState({
        value,
        maxLength,
      });
    }, [value, maxLength, setInputState]);

    const handleWheel = (e: WheelEvent<HTMLInputElement>) => {
      if (isNumberType) {
        e.currentTarget.blur();
      }
    };

    return (
      <>
        <input
          ref={inputRef}
          type={inputType}
          aria-invalid={isError}
          className={mergeClassNames(textfieldInputStyle, className)}
          onChange={_onChange}
          onWheel={handleWheel}
          value={value}
          maxLength={maxLength}
          {...restHtmlInputProps}
        />
        {onClear && (
          <Icon
            name="ic-closeCircle"
            className={clearButtonStyle}
            filled
            size={20}
            colorToken="button-tertiary-fg"
            onMouseDown={(e) => {
              e.preventDefault();
              handleClear();
            }}
          />
        )}
        {isPasswordType && (
          <Icon
            name={isPasswordVisible ? 'ic-eyeClosed' : 'ic-eye'}
            className={eyeButtonStyle}
            filled
            size={20}
            colorToken="button-tertiary-fg"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsPasswordVisible(!isPasswordVisible);
            }}
          />
        )}
      </>
    );
  },
);

TextfieldInput.displayName = 'Textfield.Input';

export { TextfieldInput };
