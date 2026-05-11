import { OptionList } from './optionlist';
import { OptionListCreatable } from './optionlist-creatable';
import { OptionListEmpty } from './optionlist-empty';
import { OptionListGroup } from './optionlist-group';
import { OptionListGroupTitle } from './optionlist-group-title';
import { OptionListInput } from './optionlist-input';
import { OptionListItem } from './optionlist-item';

const OptionListNamespace = Object.assign(OptionList, {
  Group: OptionListGroup,
  GroupTitle: OptionListGroupTitle,
  Item: OptionListItem,
  Input: OptionListInput,
  Creatable: OptionListCreatable,
  Empty: OptionListEmpty,
});

export { OptionListNamespace as OptionList };
export type { OptionListItemProps } from './optionlist-item';
