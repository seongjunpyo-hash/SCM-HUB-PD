import { SelectOption } from '../multi-select-option';
import { SelectOptionList } from '../multi-select-option-list';
import { SelectRoot } from '../multi-select-root';
import { SelectTrigger } from '../multi-select-trigger';

import { OptionList } from '@/components/OptionList';

import type { MultiSelectProps } from './multi-select.types';

export function MultiSelect<T extends string>({
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
  summaryWithCount = false,
  floatingBlockLabel,
  required,

  // option list props
  placement = 'bottom',
  optionWidth,
  optionMaxHeight,
}: MultiSelectProps<T>) {
  return (
    <SelectRoot value={value} onValueChange={onValueChange} options={options}>
      <SelectTrigger
        size={size}
        validation={validation}
        onClear={onClear}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        summaryWithCount={summaryWithCount}
        floatingBlockLabel={floatingBlockLabel}
        required={required}
      />

      <SelectOptionList placement={placement} width={optionWidth} maxHeight={optionMaxHeight}>
        <OptionList.Group>
          {options.map((option) => (
            <SelectOption key={option.value} value={option.value} label={option.label} />
          ))}
        </OptionList.Group>
      </SelectOptionList>
    </SelectRoot>
  );
}
