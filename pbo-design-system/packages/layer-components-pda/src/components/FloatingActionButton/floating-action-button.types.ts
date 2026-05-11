import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { ButtonHTMLAttributes } from 'react';

export type FloatingActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  LabelOrChildren & {
    prefixIcon?: IconName;
  };
