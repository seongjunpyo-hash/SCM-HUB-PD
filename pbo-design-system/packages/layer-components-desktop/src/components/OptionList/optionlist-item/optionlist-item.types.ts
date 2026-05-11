import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { HTMLAttributes } from 'react';

export type OptionListItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  label: string;
  isSelected?: boolean;
  selectionType?: 'default' | 'checkMark' | 'checkBox';
  subTitle?: string;
  description?: string;
  suffixSubtle?: string;
  suffixIcon?: IconName;
  thumbnail?: string;
};
