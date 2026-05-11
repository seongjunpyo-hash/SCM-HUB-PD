import { forwardRef, useState } from 'react';

import { tokens } from '@musinsa/layer-tokens/desktop';
import * as PrimitiveTooltip from '@radix-ui/react-tooltip';

import { TooltipContextProvider, useTooltipContext } from './_context/tooltip-context';
import { arrowStartStyle, tooltipContentStyle, variantStyles } from './tooltip.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TooltipContentProps, TooltipRootProps, TooltipTriggerProps } from './tooltip.types';

/** Root */
const TooltipRoot = ({ children }: TooltipRootProps) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContextProvider open={open} setOpen={setOpen}>
      <PrimitiveTooltip.Provider delayDuration={0}>
        <PrimitiveTooltip.Root open={open}>{children}</PrimitiveTooltip.Root>
      </PrimitiveTooltip.Provider>
    </TooltipContextProvider>
  );
};

/** Trigger */
const TooltipTrigger = ({ children, action = 'hover' }: TooltipTriggerProps) => {
  const { setOpen } = useTooltipContext();

  const _onMouseEnter = () => {
    if (action === 'hover') {
      setOpen(true);
    }
  };

  const _onMouseLeave = () => {
    if (action === 'hover') {
      setOpen(false);
    }
  };

  const _onClick = () => {
    if (action === 'click') {
      setOpen((prev) => !prev);
    }
  };

  return (
    <PrimitiveTooltip.Trigger asChild onMouseEnter={_onMouseEnter} onMouseLeave={_onMouseLeave} onClick={_onClick}>
      {children}
    </PrimitiveTooltip.Trigger>
  );
};

const DEFAULT_VARIANT: TooltipContentProps['variant'] = 'black';
const DEFAULT_PLACEMENT: TooltipContentProps['placement'] = 'top';

/** Content */
const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, variant = DEFAULT_VARIANT, placement = DEFAULT_PLACEMENT, ...htmlDivProps }, ref) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    const getSide = (placement: NonNullable<TooltipContentProps['placement']>) => {
      if (placement.includes('top')) return 'top';
      if (placement.includes('bottom')) return 'bottom';
      if (placement.includes('left')) return 'left';
      if (placement.includes('right')) return 'right';
      return 'top';
    };

    const getAlign = (placement: NonNullable<TooltipContentProps['placement']>) => {
      if (placement.includes('Start')) return 'start';
      if (placement.includes('End')) return 'end';
      return undefined;
    };

    const side = getSide(placement);
    const align = getAlign(placement);

    return (
      <PrimitiveTooltip.Portal>
        <PrimitiveTooltip.Content
          ref={ref}
          sideOffset={4}
          side={side}
          align={align}
          className={mergeClassNames(tooltipContentStyle, variantStyles[variant], className)}
          {...restHtmlDivProps}
        >
          {children}
          <PrimitiveTooltip.Arrow
            className={align === 'start' ? arrowStartStyle : undefined}
            fill={variant === 'black' ? tokens.tooltip.black.bg : tokens.tooltip.white.bg}
          />
        </PrimitiveTooltip.Content>
      </PrimitiveTooltip.Portal>
    );
  },
);

TooltipContent.displayName = 'TooltipContent';

const TooltipNamespace = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};

export { TooltipNamespace as Tooltip };
