import type { SelectOptionProps } from '../select-option';
import type { SelectOptionListProps } from '../select-option-list';
import type { SelectRootProps } from '../select-root';
import type { SelectTriggerProps } from '../select-trigger';

type RootProps<T extends string> = Omit<SelectRootProps<T>, 'children'>;

type TriggerProps = SelectTriggerProps;

type OptionListProps = Pick<SelectOptionListProps, 'placement'> & {
  optionWidth?: string | number;
  optionMaxHeight?: string | number;
};

type OptionProps = Pick<SelectOptionProps, 'selectionType'>;

export type SelectProps<T extends string> = RootProps<T> & TriggerProps & OptionListProps & OptionProps;
