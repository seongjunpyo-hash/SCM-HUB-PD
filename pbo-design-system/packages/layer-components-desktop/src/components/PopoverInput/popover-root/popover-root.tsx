import { useState } from 'react';

import * as PrimitiveSelect from '@radix-ui/react-select';

import { PopoverInputContextProvider } from '../_context/popover-input-context';

import type { PopoverRootProps } from './popover-root.types';

export function PopoverRoot({ children, open: openProp, setOpen: setOpenProp }: PopoverRootProps) {
  const [open, setOpen] = useState(false);

  // prop으로 open을 받았다면 prop 사용
  const contextValue = {
    open: openProp === undefined ? open : openProp,
    setOpen: setOpenProp === undefined ? setOpen : setOpenProp,
  };

  return (
    <PopoverInputContextProvider {...contextValue}>
      <PrimitiveSelect.Root open={contextValue.open} onOpenChange={setOpenProp || undefined}>
        {children}
      </PrimitiveSelect.Root>
    </PopoverInputContextProvider>
  );
}
