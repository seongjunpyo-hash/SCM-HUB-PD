import type { HTMLAttributes, PropsWithChildren } from 'react';

export type SelectOptionListProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    placement?: 'top' | 'bottom';
    width?: string | number;
    maxHeight?: string | number;
  };
