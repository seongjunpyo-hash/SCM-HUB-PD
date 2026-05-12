import { forwardRef } from 'react';

import { iconSizeMap } from './button.constants';
import { buttonStyle, sizeStyles, spinnerStyle, variantStyles, widthModeStyles } from './button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { ForwardedRef } from 'react';
import type { ButtonProps } from './button.types';

const DEFAULT_VARIANT: ButtonProps['variant'] = 'primary';
const DEFAULT_SIZE: ButtonProps['size'] = 'xlarge';
const DEFAULT_WIDTH_MODE: ButtonProps['widthMode'] = 'full';
const DEFAULT_IS_LOADING: ButtonProps['isLoading'] = false;

const Comp = (
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
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  const { className, ...restHtmlButtonProps } = htmlButtonProps;

  const iconSize = iconSizeMap[size];

  const PrefixIcon = getIcon(prefixIconName);
  const SuffixIcon = getIcon(suffixIconName);

  return (
    <button
      ref={ref}
      className={mergeClassNames(
        buttonStyle,
        variantStyles[variant],
        sizeStyles[size],
        widthModeStyles[widthMode],
        className,
      )}
      {...restHtmlButtonProps}
    >
      {isLoading ? (
        <div className={spinnerStyle} />
      ) : (
        <>
          {PrefixIcon && <PrefixIcon size={iconSize} color="currentColor" />}
          {label ?? children}
          {SuffixIcon && <SuffixIcon size={iconSize} color="currentColor" />}
        </>
      )}
    </button>
  );
};

const Button = forwardRef(Comp);
Button.displayName = 'Button';

export { Button };
