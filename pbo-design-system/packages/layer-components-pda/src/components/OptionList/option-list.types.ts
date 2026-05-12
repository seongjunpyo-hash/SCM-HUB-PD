import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { HTMLAttributes } from 'react';

export type OptionListProps = HTMLAttributes<HTMLDivElement> &
  LabelOrChildren & {
    type?: 'default' | 'code';
    isChecked?: boolean;
    disabled?: boolean;
  };
