import type { HTMLAttributes, PropsWithChildren } from 'react';

export type OptionListProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    width?: string | number;
    maxHeight?: string | number;
  };
