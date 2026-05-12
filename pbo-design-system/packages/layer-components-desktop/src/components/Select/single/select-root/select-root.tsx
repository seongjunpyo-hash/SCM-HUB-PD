import { SelectContextProvider } from '../_context/select-context';

import { PopoverInput } from '@/components/PopoverInput';

import type { SelectRootProps } from './select-root.types';

export function SelectRoot<T extends string>({ children, value, options, onValueChange }: SelectRootProps<T>) {
  const contextValue = {
    value: value as string,
    onValueChange: onValueChange as (value: string) => void,
    options: options,
  };

  return (
    <SelectContextProvider {...contextValue}>
      <PopoverInput.Root>{children}</PopoverInput.Root>
    </SelectContextProvider>
  );
}
