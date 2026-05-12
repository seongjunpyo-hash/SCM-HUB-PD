import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { buttonStyle, wrapStyle } from './stepper-input.css';

import { Textfield } from '@/components/Textfield';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { StepperInputProps } from './stepper-input.types';

const DEFAULT_VALIDATION_STATE: StepperInputProps['validationState'] = 'none';
const DEFAULT_VALUE_ACCENT: StepperInputProps['valueAccent'] = true;
const DEFAULT_COUNT_TOTAL_SMALL: StepperInputProps['countTotalSmall'] = false;

const Comp = (
  {
    validationState = DEFAULT_VALIDATION_STATE,
    count,
    totalCount,
    onCountChange,
    valueAccent = DEFAULT_VALUE_ACCENT,
    countTotalSmall = DEFAULT_COUNT_TOTAL_SMALL,
    ...htmlInputProps
  }: StepperInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { className, ...restHtmlInputProps } = htmlInputProps;
  const { disabled, readOnly } = restHtmlInputProps;

  const handleMinus = () => {
    if (disabled || readOnly) {
      return;
    }
    onCountChange?.(count ? count - 1 : 0);
  };

  const handlePlus = () => {
    const newValue = count ? count + 1 : 1;

    if (disabled || readOnly) {
      return;
    }
    if (newValue > totalCount) {
      return;
    }
    onCountChange?.(newValue);
  };

  const countInputProps = {
    validationState,
    count,
    totalCount,
    onCountChange,
    countTotalSmall,
    valueAccent,
  };

  const isMinusDisabled = count === 0;
  const isPlusDisabled = count === totalCount;
  const iconColorToken = disabled || readOnly ? 'fg-disabled' : 'fg';

  return (
    <div className={mergeClassNames(wrapStyle)}>
      {/* minus button */}
      <button className={buttonStyle} onClick={handleMinus} disabled={count === 0}>
        <Icon name="ic-minus" size={28} colorToken={isMinusDisabled ? 'fg-disabled' : iconColorToken} />
      </button>

      {/* CountInput */}
      <Textfield.CountInput
        ref={ref}
        className={mergeClassNames(className)}
        {...countInputProps}
        {...restHtmlInputProps}
      />

      {/* plus button */}
      <button className={buttonStyle} onClick={handlePlus} disabled={isPlusDisabled}>
        <Icon name="ic-plus" size={28} colorToken={isPlusDisabled ? 'fg-disabled' : iconColorToken} />
      </button>
    </div>
  );
};

const StepperInput = forwardRef(Comp);
StepperInput.displayName = 'StepperInput';

export { StepperInput };
