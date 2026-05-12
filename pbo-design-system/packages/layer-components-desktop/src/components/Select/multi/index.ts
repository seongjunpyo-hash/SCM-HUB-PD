import { SelectOptionList } from '../single/select-option-list';

import { MultiSelect } from './multi-select';
import { SelectOption } from './multi-select-option';
import { SelectOptionAll } from './multi-select-option-all';
import { SelectRoot } from './multi-select-root';
import { SelectTrigger } from './multi-select-trigger';

import { OptionList } from '@/components/OptionList';

const MultiSelectNamespace = Object.assign(MultiSelect, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  OptionList: SelectOptionList,
  Option: SelectOption,
  OptionAll: SelectOptionAll,

  // optionList components
  OptionGroup: OptionList.Group,
  OptionGroupTitle: OptionList.GroupTitle,
  OptionInput: OptionList.Input,
  OptionCreatable: OptionList.Creatable,
  OptionEmpty: OptionList.Empty,
});

export { MultiSelectNamespace as MultiSelect };
