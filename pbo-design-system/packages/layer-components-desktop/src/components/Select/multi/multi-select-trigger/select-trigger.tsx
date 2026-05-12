import { forwardRef } from 'react';

import { useMultipleSelectContext } from '../_context/multiple-select-context';

import { multipleValueCountStyle, summaryWithCountWrapStyle } from './select-trigger.css';

import { PopoverInput } from '@/components/PopoverInput';
import { Typography } from '@/components/Typography';

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
      summaryWithCount = false,
      placeholder,
      floatingBlockLabel,
      required,
      onClear,
      ...htmlButtonProps
    },
    ref,
  ) => {
    const { value: multipleValue, options } = useMultipleSelectContext();
    const isEmpty = multipleValue.length === 0;

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

    const displayValue = isEmpty ? null : summaryWithCount ? (
      <SummaryWithCount size={size} disabled={disabled} />
    ) : (
      multipleValue.map((v) => options.find((o) => o.value === v)?.label).join(', ')
    );

    return <PopoverInput.Trigger ref={ref} displayValue={displayValue} {...popoverInputTriggerProps} />;
  },
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };

function SummaryWithCount({ size, disabled }: { size: SelectTriggerProps['size']; disabled: boolean }) {
  const { value: multipleValue, options } = useMultipleSelectContext();

  const firstLabel = options.find((o) => o.value === multipleValue?.[0])?.label;
  const otherCount = multipleValue.length - 1;

  return (
    <div className={summaryWithCountWrapStyle}>
      <Typography
        as="span"
        name={size === 'medium' ? 'base-text-l' : 'base-text-m'}
        colorToken={disabled ? 'fg-disabled' : 'fg'}
      >
        {firstLabel}
      </Typography>
      {otherCount > 0 && (
        <div className={multipleValueCountStyle({ disabled })}>
          <Typography
            name={size === 'medium' ? 'base-text-l' : 'base-text-m'}
            colorToken={disabled ? 'fg-disabled' : 'fg'}
          >
            외 {otherCount}
          </Typography>
        </div>
      )}
    </div>
  );
}
