import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  LabelOrChildren & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'negative';
    size?: 'xlarge' | 'large' | 'medium' | 'small';
    isLoading?: boolean;
    widthMode?: 'full';
    prefixIcon?: IconName;
    suffixIcon?: IconName;
  };
