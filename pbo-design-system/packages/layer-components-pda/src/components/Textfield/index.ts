import { TextfieldCountInput } from './textfield-countInput';
import { TextfieldHelpText } from './textfield-helpText';
import { TextfieldInput } from './textfield-input';
import { TextfieldRoot } from './textfield-root/textfield-root';
import { TextfieldSearchInput } from './textfield-searchInput';

const TextfieldNamespace = Object.assign(TextfieldInput, {
  Root: TextfieldRoot,
  Input: TextfieldInput,
  SearchInput: TextfieldSearchInput,
  CountInput: TextfieldCountInput,
  HelpText: TextfieldHelpText,
});

export {
  TextfieldCountInput as CountTextfield,
  TextfieldSearchInput as SearchTextfield,
  TextfieldNamespace as Textfield,
};
