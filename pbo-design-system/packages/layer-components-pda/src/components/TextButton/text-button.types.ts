import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { ButtonHTMLAttributes } from 'react';

export type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  LabelOrChildren &
  Variant & {
    size?: 'medium' | 'small';
    prefixIcon?: IconName;
    suffixIcon?: IconName;
  };

type Primary = {
  variant: 'primary';
  tone?: 'default' | 'onContrast';
};

type Secondary = {
  variant: 'secondary';
  tone?: 'default';
};

type Accent = {
  variant?: 'accent';
  tone?: 'default' | 'onContrast';
};

type Variant = Primary | Secondary | Accent;
