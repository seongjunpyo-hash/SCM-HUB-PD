import { forwardRef } from 'react';

import * as PrimitiveSwitch from '@radix-ui/react-switch';

import { switchInputStyle, switchThumbStyle } from './switch-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { SwitchInputProps } from './switch-input.types';

const SwitchInput = forwardRef<HTMLButtonElement, SwitchInputProps>(
  ({ checked, onCheckedChange, ...htmlButtonProps }, ref) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    return (
      <PrimitiveSwitch.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={mergeClassNames(switchInputStyle, className)}
        {...restHtmlButtonProps}
      >
        <PrimitiveSwitch.Thumb className={switchThumbStyle} />
      </PrimitiveSwitch.Root>
    );
  },
);

SwitchInput.displayName = 'SwitchInput';

export { SwitchInput };
