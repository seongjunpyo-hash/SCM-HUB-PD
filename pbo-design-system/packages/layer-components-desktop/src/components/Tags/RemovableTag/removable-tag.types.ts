import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { HTMLAttributes } from 'react';

export type RemovableTagProps = HTMLAttributes<HTMLDivElement> &
  LabelOrChildren & {
    variant?: 'filled' | 'outlined';
    size?: 'large' | 'small';
    disabled?: boolean;
    onRemove?: () => void;
  };
