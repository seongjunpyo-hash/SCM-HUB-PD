import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  LabelOrChildren & {
    size?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
    widthMode?: 'default' | 'compact';
    isLoading?: boolean;
    prefixIcon?: IconName;
    suffixIcon?: IconName;
  };

export type PrimaryButtonProps = ButtonProps & {
  variant?: 'filled' | 'accentFilled' | 'outlined' | 'accentOutlined' | 'ghost' | 'accentGhost';
};

export type SecondaryButtonProps = ButtonProps & {
  variant?: 'filled' | 'outlined' | 'ghost';
};

export type NegativeButtonProps = ButtonProps & {
  variant?: 'filled' | 'outlined' | 'ghost';
};
