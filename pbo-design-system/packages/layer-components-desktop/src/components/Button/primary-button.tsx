import { forwardRef } from 'react';

import { buttonIconSizeMap } from './button.constants';
import { buttonStyle, sizeStyles, spinnerStyle } from './button.css';
import { primaryVariantStyles } from './primary-button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { PrimaryButtonProps } from './button.types';

const DEFAULT_VARIANT: PrimaryButtonProps['variant'] = 'filled';
const DEFAULT_SIZE: PrimaryButtonProps['size'] = 'xlarge';
const DEFAULT_WIDTH_MODE: PrimaryButtonProps['widthMode'] = 'default';
const DEFAULT_IS_LOADING: PrimaryButtonProps['isLoading'] = false;

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      variant = DEFAULT_VARIANT,
      size = DEFAULT_SIZE,
      widthMode = DEFAULT_WIDTH_MODE,
      isLoading = DEFAULT_IS_LOADING,
      prefixIcon: prefixIconName,
      suffixIcon: suffixIconName,
      label,
      children,
      ...htmlButtonProps
    },
    ref,
  ) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    const PrefixIcon = getIcon(prefixIconName);
    const SuffixIcon = getIcon(suffixIconName);

    return (
      <button
        ref={ref}
        className={mergeClassNames(
          buttonStyle,
          primaryVariantStyles[variant],
          sizeStyles({ size, widthMode }),
          className,
        )}
        {...restHtmlButtonProps}
      >
        {isLoading ? (
          <div className={spinnerStyle} />
        ) : (
          <>
            {PrefixIcon && <PrefixIcon size={buttonIconSizeMap[size]} color="currentColor" />}
            {label ?? children}
            {SuffixIcon && <SuffixIcon size={buttonIconSizeMap[size]} color="currentColor" />}
          </>
        )}
      </button>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';

export { PrimaryButton };
