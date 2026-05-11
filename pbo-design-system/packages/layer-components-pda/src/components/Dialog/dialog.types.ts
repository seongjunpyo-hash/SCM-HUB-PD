import type { HTMLAttributes, PropsWithChildren } from 'react';

export type DialogProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    open: boolean;
    type?: 'default' | 'failFeedback';
  };
