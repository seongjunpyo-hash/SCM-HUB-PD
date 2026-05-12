import type { HTMLAttributes } from 'react';

export type LabelTagProps = HTMLAttributes<HTMLDivElement> & {
  colorVariant?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
  size?: 'xsmall' | 'small' | 'medium';
  label: string;
  count?: number;
  infoIcon?: boolean;
};
