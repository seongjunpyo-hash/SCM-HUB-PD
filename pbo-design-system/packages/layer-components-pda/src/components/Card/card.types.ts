import type { HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string | number;
  validationState?: 'default' | 'critical' | 'accent';
};
