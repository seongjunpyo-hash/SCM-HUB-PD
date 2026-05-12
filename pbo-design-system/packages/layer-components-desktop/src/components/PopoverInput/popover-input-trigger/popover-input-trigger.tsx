import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';

import { Icon } from '@musinsa/pbo-assets';
import * as PrimitiveSelect from '@radix-ui/react-select';

import { usePopoverInputContext } from '../_context/popover-input-context';

import {
  chvronDownStyle,
  clearButtonStyle,
  displayValueStyle,
  floatingLabelStyle,
  requiredIndicatorStyle,
  sizeStyles,
  triggerStyle,
} from './popover-input-trigger.css';

import { IconButton } from '@/components/IconButton';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { PopoverInputTriggerProps } from './popover-input-trigger.types';

const DEFAULT_SIZE: PopoverInputTriggerProps['size'] = 'medium';
const DEFAULT_VALIDATION: PopoverInputTriggerProps['validation'] = 'none';

const PopoverInputTrigger = forwardRef<HTMLButtonElement, PopoverInputTriggerProps>(
  (
    {
      size = DEFAULT_SIZE,
      validation = DEFAULT_VALIDATION,
      disabled = false,
      readOnly = false,
      required = false,
      placeholder,
      displayValue,
      floatingBlockLabel,
      onClear,
      ...htmlButtonProps
    },
    ref,
  ) => {
    const { className, onClick, onKeyDown, ...restHtmlButtonProps } = htmlButtonProps;

    const { setOpen } = usePopoverInputContext();

    const isError = validation === 'error';
    const iconColorToken = disabled || readOnly ? 'fg-disabled' : 'fg';

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      setOpen((prev) => !prev);
      onClick?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setOpen((prev) => !prev);
      }
      onKeyDown?.(e);
    };

    const handleClear = (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClear?.();
    };

    return (
      <PrimitiveSelect.Trigger
        ref={ref}
        className={mergeClassNames(triggerStyle, sizeStyles[size], className)}
        disabled={disabled || readOnly}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        aria-invalid={isError ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-display-floating-label={floatingBlockLabel ? 'true' : undefined}
        // radix에서 제공해주는것 오버라이딩
        data-placeholder={!displayValue ? 'true' : undefined}
        {...restHtmlButtonProps}
      >
        {floatingBlockLabel && (
          <div className={floatingLabelStyle({ size })}>
            <span>{floatingBlockLabel}</span>
            {required && <span className={requiredIndicatorStyle} />}
          </div>
        )}
        <div className={displayValueStyle}>{displayValue || placeholder}</div>

        {onClear && (
          <IconButton
            className={clearButtonStyle}
            icon="ic-closeCircle"
            iconFilled
            size="2xsmall"
            buttonType="tertiary"
            variant="ghost"
            onClick={handleClear}
            onKeyDown={handleClear}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
        <PrimitiveSelect.Icon asChild>
          <Icon className={chvronDownStyle} name="ic-chevronDown" size={20} colorToken={iconColorToken} />
        </PrimitiveSelect.Icon>
      </PrimitiveSelect.Trigger>
    );
  },
);

PopoverInputTrigger.displayName = 'PopoverInputTrigger';

export { PopoverInputTrigger };
