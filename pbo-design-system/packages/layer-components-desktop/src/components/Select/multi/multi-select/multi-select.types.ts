import type { SelectOptionListProps } from '../multi-select-option-list';
import type { SelectRootProps } from '../multi-select-root';
import type { SelectTriggerProps } from '../multi-select-trigger';

type RootProps<T extends string> = Omit<SelectRootProps<T>, 'children'>;

type TriggerProps = SelectTriggerProps;

type OptionListProps = Pick<SelectOptionListProps, 'placement'> & {
  optionWidth?: string | number;
  optionMaxHeight?: string | number;
};

export type MultiSelectProps<T extends string> = RootProps<T> & TriggerProps & OptionListProps;
