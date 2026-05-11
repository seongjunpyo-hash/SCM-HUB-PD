import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';
import * as PrimitiveCheckbox from '@radix-ui/react-checkbox';

import { iconSizeMap } from './checkbox-input.constants';
import { checkboxRootStyle, indicatorStyle, sizeStyles } from './checkbox-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { CheckboxInputProps } from './checkbox-input.types';

const DEFAULT_SIZE: CheckboxInputProps['size'] = 'small';
const DEFAULT_VALIDATION: CheckboxInputProps['validation'] = 'none';
const DEFAULT_CHECKED: CheckboxInputProps['checked'] = false;
const DEFAULT_IS_INDETERMINATE: CheckboxInputProps['isIndeterminate'] = false;

const CheckboxInput = forwardRef<HTMLButtonElement, CheckboxInputProps>(
  (
    {
      size = DEFAULT_SIZE,
      checked = DEFAULT_CHECKED,
      isIndeterminate = DEFAULT_IS_INDETERMINATE,
      validation = DEFAULT_VALIDATION,
      onCheckedChange,
      ...htmlButtonProps
    },
    ref,
  ) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    const isError = validation === 'error';

    return (
      <PrimitiveCheckbox.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-invalid={isError ? 'true' : undefined}
        className={mergeClassNames(checkboxRootStyle, sizeStyles[size], className)}
        {...restHtmlButtonProps}
      >
        <PrimitiveCheckbox.Indicator className={indicatorStyle}>
          <Icon
            iconStroke="200"
            name={isIndeterminate ? 'ic-minus' : 'ic-check'}
            colorToken="control-indicator-bg-checked"
            size={iconSizeMap[size]}
          />
        </PrimitiveCheckbox.Indicator>
      </PrimitiveCheckbox.Root>
    );
  },
);

CheckboxInput.displayName = 'CheckboxInput';

export { CheckboxInput };
