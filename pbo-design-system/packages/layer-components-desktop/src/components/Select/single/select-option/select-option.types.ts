import type { OptionList } from '@/components/OptionList';
import type { ComponentProps } from 'react';

type OptionListItemProps = ComponentProps<typeof OptionList.Item>;

export type SelectOptionProps = Omit<OptionListItemProps, 'selectionType' | 'isSelected'> & {
  selectionType?: 'default' | 'checkMark';
};
