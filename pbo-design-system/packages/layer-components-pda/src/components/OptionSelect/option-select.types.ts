import type { HTMLAttributes, ReactNode } from 'react';

export type OptionSelectProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'large' | 'medium';
  label: string;
  description?: string;
  count?: number;
  isChecked?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};
