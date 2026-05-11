import type { OptionListItemProps } from '@/components/OptionList';

export type SelectOptionAllProps = Omit<OptionListItemProps, 'value' | 'selectionType' | 'isSelected'>;
