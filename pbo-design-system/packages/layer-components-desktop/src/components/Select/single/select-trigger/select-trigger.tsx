import { forwardRef } from 'react';

import { useSelectContext } from '../_context/select-context';

import { PopoverInput } from '@/components/PopoverInput';

import type { SelectTriggerProps } from './select-trigger.types';

export const SELECT_VALUE_ID = 'select-value-wrap';

const DEFAULT_SIZE: SelectTriggerProps['size'] = 'medium';
const DEFAULT_VALIDATION: SelectTriggerProps['validation'] = 'none';

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      size = DEFAULT_SIZE,
      validation = DEFAULT_VALIDATION,
      disabled = false,
      readOnly = false,
      placeholder,
      floatingBlockLabel,
      required,
      onClear,
      ...htmlButtonProps
    },
    ref,
  ) => {
    const popoverInputTriggerProps = {
      size,
      validation,
      disabled,
      readOnly,
      placeholder,
      floatingBlockLabel,
      required,
      onClear,
      ...htmlButtonProps,
    };

    const { value, options } = useSelectContext();

    const selectedLabel = options.find((option) => option.value === value)?.label;

    return <PopoverInput.Trigger displayValue={selectedLabel} {...popoverInputTriggerProps} ref={ref} />;
  },
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };
