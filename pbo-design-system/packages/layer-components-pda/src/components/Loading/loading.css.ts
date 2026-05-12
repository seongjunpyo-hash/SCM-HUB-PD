import { tokens } from '@musinsa/layer-tokens/pda';
import { keyframes, style, styleVariants } from '@vanilla-extract/css';

import type { LoadingProps } from './loading.types';

/** spinner animation */
const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const loadingStyle = style({
  borderRadius: '50%',
  borderStyle: 'solid',
  animation: `${spin} 1.2s linear infinite`,
  borderColor: tokens.pda['border-accent'],
  borderTopColor: tokens.stroke['border-neutral-low'],
});

export const sizeStyles: Record<NonNullable<LoadingProps['size']>, string> = styleVariants({
  medium: {
    width: 64,
    height: 64,
    borderWidth: 6,
  },
  small: {
    width: 32,
    height: 32,
    borderWidth: 4,
  },
});
