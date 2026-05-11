import { tokens } from '@musinsa/layer-tokens/desktop';

import type { ButtonProps } from './button.types';

export const buttonIconSizeMap: Record<NonNullable<ButtonProps['size']>, number> = {
  xlarge: parseInt(tokens.button.iconSize.xl),
  large: parseInt(tokens.button.iconSize.l),
  medium: parseInt(tokens.button.iconSize.m),
  small: parseInt(tokens.button.iconSize.s),
  xsmall: parseInt(tokens.button.iconSize.xs),
};
