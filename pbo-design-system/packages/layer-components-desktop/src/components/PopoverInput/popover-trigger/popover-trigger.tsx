import * as PrimitiveSelect from '@radix-ui/react-select';

import { usePopoverInputContext } from '../_context/popover-input-context';

import type { PopoverTriggerProps } from './popover-trigget.types';

const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const { setOpen } = usePopoverInputContext();

  return (
    <PrimitiveSelect.Trigger
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setOpen(true);
        }
      }}
      asChild
    >
      {children}
    </PrimitiveSelect.Trigger>
  );
};

export { PopoverTrigger };
