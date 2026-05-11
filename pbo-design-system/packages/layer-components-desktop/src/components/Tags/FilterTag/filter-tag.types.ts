import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { ButtonHTMLAttributes } from 'react';

export type FilterTagProps = ButtonHTMLAttributes<HTMLButtonElement> &
  LabelOrChildren & {
    size?: 'medium' | 'large';
    isSelected?: boolean;
  };
