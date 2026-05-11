import { Select } from './select';
import { SelectOption } from './select-option';
import { SelectOptionList } from './select-option-list';
import { SelectRoot } from './select-root';
import { SelectTrigger } from './select-trigger';

import { OptionList } from '@/components/OptionList';

const SelectNamespace = Object.assign(Select, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  OptionList: SelectOptionList,
  Option: SelectOption,

  // optionList components
  OptionGroup: OptionList.Group,
  OptionGroupTitle: OptionList.GroupTitle,
  OptionInput: OptionList.Input,
  OptionCreatable: OptionList.Creatable,
  OptionEmpty: OptionList.Empty,
});

export { SelectNamespace as Select };
