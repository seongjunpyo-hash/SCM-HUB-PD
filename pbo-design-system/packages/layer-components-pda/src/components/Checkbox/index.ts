import { CheckboxInput } from './checkbox-input';
import { CheckboxLabel } from './checkbox-label';

const CheckboxNamspace = Object.assign(CheckboxInput, {
  Input: CheckboxInput,
  Label: CheckboxLabel,
});

export { CheckboxNamspace as Checkbox };
