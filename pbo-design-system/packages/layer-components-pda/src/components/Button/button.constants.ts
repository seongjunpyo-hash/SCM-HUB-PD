import type { ButtonProps } from './button.types';

export const iconSizeMap: Record<NonNullable<ButtonProps['size']>, number> = {
  xlarge: 28,
  large: 24,
  medium: 24,
  small: 20,
};
