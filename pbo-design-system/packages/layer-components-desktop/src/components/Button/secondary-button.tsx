import { forwardRef } from 'react';

import { buttonIconSizeMap } from './button.constants';
import { buttonStyle, sizeStyles, spinnerStyle } from './button.css';
import { secondaryVariantStyles } from './secondary-button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { SecondaryButtonProps } from './button.types';

const DEFAULT_VARIANT: SecondaryButtonProps['variant'] = 'filled';
const DEFAULT_SIZE: SecondaryButtonProps['size'] = 'xlarge';
const DEFAULT_WIDTH_MODE: SecondaryButtonProps['widthMode'] = 'default';
const DEFAULT_IS_LOADING: SecondaryButtonProps['isLoading'] = false;

const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
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
          secondaryVariantStyles[variant],
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

SecondaryButton.displayName = 'SecondaryButton';

export { SecondaryButton };
