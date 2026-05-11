import { forwardRef } from 'react';

import * as PrimitiveSelect from '@radix-ui/react-select';

import { usePopoverInputContext } from '../_context/popover-input-context';

import { contentStyle } from './popover-content.css';

import { OptionList } from '@/components/OptionList';

import type { PopoverContentProps } from './popover-content.types';

const DEFAULT_PLACEMENT: PopoverContentProps['placement'] = 'bottom';

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, placement = DEFAULT_PLACEMENT, width, maxHeight, ...htmlDivProps }, ref) => {
    const { setOpen } = usePopoverInputContext();

    const handleCloseAutoFocus = (event: Event) => {
      event.preventDefault();
    };

    const handleOpenClose = () => {
      setOpen(false);
    };

    return (
      <PrimitiveSelect.Portal>
        <PrimitiveSelect.Content
          className={contentStyle}
          position="popper"
          side={placement}
          sideOffset={4}
          onCloseAutoFocus={handleCloseAutoFocus}
          onEscapeKeyDown={handleOpenClose} // esc close
          onPointerDownOutside={handleOpenClose} // click outside close
          style={{
            width: width,
            minWidth: width,
            maxWidth: width,
          }}
        >
          <OptionList width={width} maxHeight={maxHeight} ref={ref} {...htmlDivProps}>
            {children}
          </OptionList>
        </PrimitiveSelect.Content>
      </PrimitiveSelect.Portal>
    );
  },
);

PopoverContent.displayName = 'PopoverContent';

export { PopoverContent };
