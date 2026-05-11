import { forwardRef, useImperativeHandle, useRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { clearButtonStyle, inputStyle, wrapStyle } from './optionlist-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ChangeEvent } from 'react';
import type { OptionListInputProps } from './optionlist-input.types';

const OptionListInput = forwardRef<HTMLInputElement, OptionListInputProps>(
  ({ onValueChange, onChange, onClear, ...htmlInputProps }, ref) => {
    const { className, value, ...restHtmlInputProps } = htmlInputProps;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const handleClear = () => {
      onClear?.();
      inputRef.current?.focus();
    };

    return (
      <div className={wrapStyle}>
        <Icon name="ic-search" size={20} colorToken="fg-low" />
        <input
          className={mergeClassNames(inputStyle, className)}
          ref={inputRef}
          value={value}
          onChange={_onChange}
          {...restHtmlInputProps}
        />
        {value && onClear && (
          <Icon
            className={clearButtonStyle}
            filled
            name="ic-closeCircle"
            size={20}
            colorToken="button-tertiary-fg"
            onClick={handleClear}
          />
        )}
      </div>
    );
  },
);

OptionListInput.displayName = 'OptionListInput';

export { OptionListInput };
