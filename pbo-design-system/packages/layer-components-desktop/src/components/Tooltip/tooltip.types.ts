import type { HTMLAttributes, PropsWithChildren } from 'react';

export type TooltipRootProps = PropsWithChildren;

export type TooltipTriggerProps = PropsWithChildren & {
  action?: 'hover' | 'click';
};

export type TooltipContentProps = PropsWithChildren &
  HTMLAttributes<HTMLDivElement> & {
    variant?: 'black' | 'white';
    placement?: 'top' | 'topStart' | 'topEnd' | 'left' | 'right' | 'bottom' | 'bottomStart' | 'bottomEnd';
  };
