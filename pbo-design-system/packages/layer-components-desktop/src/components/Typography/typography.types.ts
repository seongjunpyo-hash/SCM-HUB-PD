import type { PolymorphicComponentWithForwardRef } from '@/shared/types/polymorphic';
import type { ColorToken, typography } from '@musinsa/layer-tokens/desktop';
import type { ReactNode } from 'react';

// color, colorToken 중 하나만 사용 가능
type ColorProps = { color?: string; colorToken?: never } | { color?: never; colorToken?: ColorToken };

type BaseName = `base-${keyof typeof typography.base}`;
type HelperTextName = `helper-text-${keyof typeof typography.helperText}`;

type TypographyName = BaseName | HelperTextName;

export type TypographyProps = ColorProps & {
  children?: ReactNode;
  name?: TypographyName;
};

export type TypographyComponent = PolymorphicComponentWithForwardRef<'p', TypographyProps>;
