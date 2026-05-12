import { forwardRef } from 'react';

import {
  defaultToneVariantStyles,
  isUnderlineStyle,
  onContrastToneVariantStyles,
  sizeStyles,
  textButtonStyle,
} from './text-button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { TextButtonProps } from './text-button.types';

const DEFAULT_VARIANT: TextButtonProps['variant'] = 'primary';
const DEFAULT_TONE: TextButtonProps['tone'] = 'default';
const DEFAULT_SIZE: TextButtonProps['size'] = 'xlarge';
const DEFAULT_IS_UNDERLINE: TextButtonProps['isUnderline'] = false;

const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      variant = DEFAULT_VARIANT,
      tone = DEFAULT_TONE,
      size = DEFAULT_SIZE,
      isUnderline = DEFAULT_IS_UNDERLINE,
      prefixIcon: prefixIconName,
      suffixIcon: suffixIconName,
      label,
      children,
      ...props
    },
    ref,
  ) => {
    const { className, ...restHtmlButtonProps } = props;

    const PrefixIcon = getIcon(prefixIconName);
    const SuffixIcon = getIcon(suffixIconName);

    const variantStyle =
      tone === 'onContrast' && variant === 'accent'
        ? onContrastToneVariantStyles[variant]
        : defaultToneVariantStyles[variant];

    return (
      <button
        ref={ref}
        className={mergeClassNames(
          textButtonStyle,
          variantStyle,
          sizeStyles[size],
          isUnderline && isUnderlineStyle,
          className,
        )}
        {...restHtmlButtonProps}
      >
        {PrefixIcon && <PrefixIcon size={20} color="currentColor" />}
        {label ?? children}
        {SuffixIcon && <SuffixIcon size={20} color="currentColor" />}
      </button>
    );
  },
);

TextButton.displayName = 'TextButton';

export { TextButton };
