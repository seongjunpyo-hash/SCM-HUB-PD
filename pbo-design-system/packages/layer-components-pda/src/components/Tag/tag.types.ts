import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { HTMLAttributes } from 'react';

export type TagProps = HTMLAttributes<HTMLDivElement> &
  LabelOrChildren & {
    stateType?: 'default' | 'neutral' | 'accent' | 'critical';
    prefixIcon?: IconName;
    suffixIcon?: IconName;
  };
