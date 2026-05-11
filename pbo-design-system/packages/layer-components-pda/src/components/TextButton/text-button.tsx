import { forwardRef } from 'react';

import { iconSizeMap } from './text-button.constants';
import { buttonStyle, defaultToneVariantStyles, onContrastToneVariantStyles, sizeStyles } from './text-button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { ForwardedRef } from 'react';
import type { TextButtonProps } from './text-button.types';

const DEFAULT_VARIANT: TextButtonProps['variant'] = 'accent';
const DEFAULT_SIZE: TextButtonProps['size'] = 'medium';
const DEFAULT_TONE: TextButtonProps['tone'] = 'default';

const Comp = (
  {
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    tone = DEFAULT_TONE,
    prefixIcon: prefixIconName,
    suffixIcon: suffixIconName,
    label,
    children,
    ...htmlButtonProps
  }: TextButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  const { className, ...restHtmlButtonProps } = htmlButtonProps;

  const iconSize = iconSizeMap[size];

  const PrefixIcon = getIcon(prefixIconName);
  const SuffixIcon = getIcon(suffixIconName);

  const variantStyle =
    tone === 'onContrast' && (variant === 'primary' || variant === 'accent')
      ? onContrastToneVariantStyles[variant]
      : defaultToneVariantStyles[variant];

  return (
    <button
      ref={ref}
      className={mergeClassNames(buttonStyle, variantStyle, sizeStyles[size], className)}
      {...restHtmlButtonProps}
    >
      {PrefixIcon && <PrefixIcon size={iconSize} color="currentColor" />}
      {label ?? children}
      {SuffixIcon && <SuffixIcon size={iconSize} color="currentColor" />}
    </button>
  );
};

const TextButton = forwardRef(Comp);
TextButton.displayName = 'TextButton';

export { TextButton };
