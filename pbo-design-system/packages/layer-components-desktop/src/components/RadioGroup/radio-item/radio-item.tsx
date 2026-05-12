import { forwardRef } from 'react';

import * as PrimitiveRadioGroup from '@radix-ui/react-radio-group';

import { indicatorSizeStyles, indicatorStyle, itemSizeStyles, itemStyle } from './radio-item.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { RadioInputProps } from './radio-item.types';

const DEFAULT_SIZE: RadioInputProps['size'] = 'small';
const DEFAULT_VALIDATION: RadioInputProps['validation'] = 'none';

const RadioItem = forwardRef<HTMLButtonElement, RadioInputProps>(
  ({ size = DEFAULT_SIZE, validation = DEFAULT_VALIDATION, value, ...htmlInputProps }, ref) => {
    const { className, ...restHtmlInputProps } = htmlInputProps;

    const isError = validation === 'error';

    return (
      <PrimitiveRadioGroup.Item
        ref={ref}
        aria-invalid={isError ? 'true' : undefined}
        value={value}
        className={mergeClassNames(itemStyle, itemSizeStyles[size], className)}
        {...restHtmlInputProps}
      >
        <PrimitiveRadioGroup.Indicator className={mergeClassNames(indicatorStyle, indicatorSizeStyles[size])} />
      </PrimitiveRadioGroup.Item>
    );
  },
);

RadioItem.displayName = 'RadioItem';

export { RadioItem };
