/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { countInputStyle, countInputTotalCountStyle, countInputWrapStyle } from './textfield-countInput.css';

import { Typography } from '@/components/Typography';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ChangeEvent, ForwardedRef } from 'react';
import type { TextfieldCountInputProps } from './textfield-countInput.types';

const DEFAULT_VALIDATION_STATE: TextfieldCountInputProps['validationState'] = 'none';
const DEFAULT_COUNT_TOTAL_SMALL: TextfieldCountInputProps['countTotalSmall'] = false;
const DEFAULT_VALUE_ACCENT: TextfieldCountInputProps['valueAccent'] = true;

const Comp = (
  {
    validationState = DEFAULT_VALIDATION_STATE,
    countTotalSmall = DEFAULT_COUNT_TOTAL_SMALL,
    valueAccent = DEFAULT_VALUE_ACCENT,
    count,
    totalCount,
    onCountChange,
    ...htmlInputProps
  }: TextfieldCountInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { className, onChange, ...restHtmlInputProps } = htmlInputProps;
  const { disabled } = restHtmlInputProps;

  const countInputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => countInputRef.current as HTMLInputElement);

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);

    // toLocaleString() 제거
    const numberValue = Number(e.target.value.replace(/,/g, ''));
    if (isNaN(numberValue)) {
      return;
    }
    if (numberValue > totalCount) {
      return;
    }

    onCountChange?.(numberValue);
  };

  const isError = validationState === 'error';

  return (
    <div className={countInputWrapStyle} onClick={() => countInputRef.current?.focus()}>
      <input
        ref={countInputRef}
        aria-invalid={isError}
        className={mergeClassNames(countInputStyle({ valueAccent }), className)}
        value={count ? count.toLocaleString() : ''}
        placeholder="0"
        onChange={_onChange}
        {...restHtmlInputProps}
      />
      <Typography
        as="span"
        name={countTotalSmall ? 'base-text-m-medium' : 'base-text-xl-medium'}
        colorToken={disabled || countTotalSmall ? 'fg-disabled' : 'fg-lower'}
      >
        /
      </Typography>
      <Typography
        as="span"
        className={countInputTotalCountStyle}
        name={countTotalSmall ? 'base-text-m-medium' : 'base-text-xl-medium'}
        colorToken={disabled ? 'fg-disabled' : countTotalSmall ? 'fg-lower' : 'fg'}
      >
        {totalCount.toLocaleString()}
      </Typography>
    </div>
  );
};

const TextfieldCountInput = forwardRef(Comp);
TextfieldCountInput.displayName = 'TextfieldCountInput';

export { TextfieldCountInput };
