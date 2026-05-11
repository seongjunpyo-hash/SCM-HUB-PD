import { forwardRef, type ForwardedRef } from 'react';

import * as PrimitiveRadioGroup from '@radix-ui/react-radio-group';

import type { RadioRootProps } from './radio-root.types';

const _RadioRoot = <T extends string>(
  { value, onValueChange, children }: RadioRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <PrimitiveRadioGroup.Root ref={ref} value={value} onValueChange={onValueChange}>
      {children}
    </PrimitiveRadioGroup.Root>
  );
};

const RadioRoot = forwardRef(_RadioRoot) as <T extends string>(
  props: RadioRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof _RadioRoot>;

export { RadioRoot };
