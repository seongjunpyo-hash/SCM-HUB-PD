/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { textfieldInputClearButtonStyle, textfieldInputStyle, textfieldInputWrapStyle } from './textfield-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ChangeEvent, ForwardedRef } from 'react';
import type { TextfieldInputProps } from './textfield-input.types';

const DEFAULT_VALIDATION_STATE: TextfieldInputProps['validationState'] = 'none';

const Comp = (
  { validationState = DEFAULT_VALIDATION_STATE, onValueChange, ...htmlInputProps }: TextfieldInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { className, value, onChange, ...restHtmlInputProps } = htmlInputProps;

  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const handleClear = () => {
    onValueChange?.('');
    onChange?.({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
    inputRef.current!.value = '';
    inputRef.current?.focus();
  };

  const isError = validationState === 'error';

  return (
    <div
      className={textfieldInputWrapStyle}
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        value={value}
        aria-invalid={isError}
        className={mergeClassNames(textfieldInputStyle, className)}
        onChange={_onChange}
        {...restHtmlInputProps}
      />
      {Boolean(value) && (
        <Icon
          className={mergeClassNames(textfieldInputClearButtonStyle)}
          name="ic-closeCircle"
          filled
          size={28}
          colorToken="textField-clearButton"
          onMouseDown={(e) => {
            e.preventDefault();
            handleClear();
          }}
        />
      )}
    </div>
  );
};

const TextfieldInput = forwardRef(Comp);
TextfieldInput.displayName = 'TextfieldInput';

export { TextfieldInput };
