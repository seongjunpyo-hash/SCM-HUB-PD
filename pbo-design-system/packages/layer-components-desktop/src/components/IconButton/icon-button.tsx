import { forwardRef } from 'react';

import { iconSizeMap } from './icon-button.contants';
import {
  iconButtonStyle,
  negativeStyles,
  primaryStyles,
  secondaryStyles,
  sizeStyles,
  tertiaryStyles,
} from './icon-button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { IconButtonProps } from './icon-button.types';

const DEFAULT_TYPE: IconButtonProps['buttonType'] = 'secondary';
const DEFAULT_VARIANT: IconButtonProps['variant'] = 'outlined';
const DEFAULT_SIZE: IconButtonProps['size'] = 'xlarge';
const DEFAULT_ICON_FILLED: IconButtonProps['iconFilled'] = false;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      buttonType = DEFAULT_TYPE,
      variant = DEFAULT_VARIANT,
      size = DEFAULT_SIZE,
      iconFilled = DEFAULT_ICON_FILLED,
      icon: iconName,
      ...htmlButtonProps
    },
    ref,
  ) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    const variantStyle = getVariantStyle(buttonType, variant);

    const Icon = getIcon(iconName);

    return (
      <button
        ref={ref}
        className={mergeClassNames(iconButtonStyle, variantStyle, sizeStyles[size], className)}
        {...restHtmlButtonProps}
      >
        {Icon && <Icon size={iconSizeMap[size]} color="currentColor" filled={iconFilled} />}
      </button>
    );
  },
);

const getVariantStyle = (buttonType: IconButtonProps['buttonType'], variant?: IconButtonProps['variant']) => {
  if (!variant || !buttonType) return undefined;

  const variantStyles = {
    primary: primaryStyles,
    secondary: secondaryStyles,
    tertiary: tertiaryStyles,
    negative: negativeStyles,
  }[buttonType];

  if (!variantStyles) return undefined;

  return variantStyles[variant as keyof typeof variantStyles];
};

IconButton.displayName = 'IconButton';

export { IconButton };
