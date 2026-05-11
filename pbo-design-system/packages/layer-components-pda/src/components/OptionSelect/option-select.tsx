import { forwardRef } from 'react';

import { Typography } from '../Typography';

import {
  checkedStyle,
  descriptionStyle,
  disabledStyle,
  leftWrapStyle,
  optionSelectStyle,
  sizeStyles,
} from './option-select.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { OptionSelectProps } from './option-select.types';

const DEFAULT_SIZE: OptionSelectProps['size'] = 'large';

const Comp = (
  { size = DEFAULT_SIZE, label, description, count, isChecked, disabled, icon, ...htmlDivProps }: OptionSelectProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  const labelColorToken = disabled ? 'fg-disabled' : isChecked ? 'pda-fg-accent' : 'fg';
  const descriptionColorToken = disabled ? 'fg-disabled' : 'fg-lower';
  const descriptionValueColorToken = disabled ? 'fg-disabled' : 'fg';

  return (
    <div
      ref={ref}
      className={mergeClassNames(
        optionSelectStyle,
        sizeStyles[size],
        isChecked && checkedStyle,
        disabled && disabledStyle,
        className,
      )}
      {...restHtmlDivProps}
    >
      <div className={leftWrapStyle}>
        <Typography name="base-text-xl-medium" colorToken={labelColorToken}>
          {label}
        </Typography>
        {(description || count) && (
          <div className={descriptionStyle}>
            {description && (
              <Typography name="base-text-s" colorToken={descriptionColorToken}>
                {description}
              </Typography>
            )}
            {count && (
              <Typography name="base-text-s" colorToken={descriptionValueColorToken}>
                {count}
              </Typography>
            )}
          </div>
        )}
      </div>
      {icon}
    </div>
  );
};

const OptionSelect = forwardRef(Comp);
OptionSelect.displayName = 'OptionSelect';

export { OptionSelect };
