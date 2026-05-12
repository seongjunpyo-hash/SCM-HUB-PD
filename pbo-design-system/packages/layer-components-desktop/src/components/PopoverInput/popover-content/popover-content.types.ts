import type { HTMLAttributes, PropsWithChildren } from 'react';

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    placement?: 'top' | 'bottom';
    width?: string | number;
    maxHeight?: string | number;
  };
