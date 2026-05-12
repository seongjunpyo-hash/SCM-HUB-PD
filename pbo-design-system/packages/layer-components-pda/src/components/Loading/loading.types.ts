import type { HTMLAttributes } from 'react';

export type LoadingProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'medium' | 'small';
};
