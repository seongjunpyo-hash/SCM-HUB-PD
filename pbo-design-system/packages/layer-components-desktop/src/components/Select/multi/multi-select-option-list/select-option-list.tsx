import { forwardRef } from 'react';

import { PopoverInput } from '@/components/PopoverInput';

import type { SelectOptionListProps } from './select-option-list.types';

const DEFAULT_PLACEMENT: SelectOptionListProps['placement'] = 'bottom';

const SelectOptionList = forwardRef<HTMLDivElement, SelectOptionListProps>(
  ({ placement = DEFAULT_PLACEMENT, width, maxHeight, children, ...htmlDivProps }, ref) => {
    const popoverInputContentProps = {
      placement,
      width,
      maxHeight,
      ...htmlDivProps,
    };

    return (
      <PopoverInput.Content {...popoverInputContentProps} ref={ref}>
        {children}
      </PopoverInput.Content>
    );
  },
);

SelectOptionList.displayName = 'SelectOptionList';

export { SelectOptionList };
