import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';
import * as PrimitiveCheckbox from '@radix-ui/react-checkbox';

import { checkboxRootStyle, indicatorStyle } from './checkbox-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { CheckboxInputProps } from './checkbox-input.types';

const DEFAULT_CHECKED: CheckboxInputProps['checked'] = false;

const CheckboxInput = forwardRef<HTMLButtonElement, CheckboxInputProps>(
  ({ checked = DEFAULT_CHECKED, onCheckedChange, ...htmlButtonProps }, ref) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    return (
      <PrimitiveCheckbox.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={mergeClassNames(checkboxRootStyle, className)}
        {...restHtmlButtonProps}
      >
        <PrimitiveCheckbox.Indicator className={indicatorStyle}>
          <Icon name="ic-check" colorToken="fg-inverse" size={20} />
        </PrimitiveCheckbox.Indicator>
      </PrimitiveCheckbox.Root>
    );
  },
);

CheckboxInput.displayName = 'CheckboxInput';

export { CheckboxInput };
