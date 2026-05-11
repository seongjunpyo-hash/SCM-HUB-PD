import { SelectOption } from '../select-option';
import { SelectOptionList } from '../select-option-list';
import { SelectRoot } from '../select-root';
import { SelectTrigger } from '../select-trigger';

import { OptionList } from '@/components/OptionList';

import type { SelectProps } from './select.types';

export function Select<T extends string>({
  // root props
  value,
  onValueChange,
  options,

  // trigger props
  size = 'medium',
  placeholder,
  validation = 'none',
  onClear,
  disabled = false,
  readOnly = false,
  floatingBlockLabel,
  required,

  // option list props
  placement = 'bottom',
  optionWidth,
  optionMaxHeight,

  // option props
  selectionType,
}: SelectProps<T>) {
  return (
    <SelectRoot value={value} onValueChange={onValueChange} options={options}>
      <SelectTrigger
        size={size}
        validation={validation}
        onClear={onClear}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        floatingBlockLabel={floatingBlockLabel}
        required={required}
      />
      <SelectOptionList placement={placement} width={optionWidth} maxHeight={optionMaxHeight}>
        <OptionList.Group>
          {options.map((option) => (
            <SelectOption selectionType={selectionType} key={option.value} value={option.value} label={option.label} />
          ))}
        </OptionList.Group>
      </SelectOptionList>
    </SelectRoot>
  );
}
