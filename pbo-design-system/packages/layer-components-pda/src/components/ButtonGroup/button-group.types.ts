import type { HTMLAttributes, PropsWithChildren } from 'react';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    stretchMode?: 'both' | 'last';
  };
