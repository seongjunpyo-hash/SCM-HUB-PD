import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { keyframes, style, styleVariants } from '@vanilla-extract/css';

import type { ButtonProps } from './button.types';

export const buttonStyle = style({
  border: 'none',
  background: 'none',
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[100],

  ':disabled': {
    cursor: 'not-allowed',
  },
});

export const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = styleVariants({
  primary: {
    backgroundColor: tokens.button.primary.bg,
    color: tokens.button.primary['fg-contrast'],
    ':active': {
      backgroundColor: tokens.button.primary['bg-pressed'],
      color: tokens.button.primary['fg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.primary['bg-disabled'],
      color: tokens.button.primary['fg-disabled'],
    },
  },
  secondary: {
    backgroundColor: tokens.button.secondary.bg,
    color: tokens.button.secondary['fg-contrast'],
    ':active': {
      backgroundColor: tokens.button.secondary['bg-pressed'],
      color: tokens.button.secondary['fg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.secondary['bg-disabled'],
      color: tokens.button.secondary['fg-disabled'],
    },
  },
  tertiary: {
    backgroundColor: tokens.button.tertiary.bg,
    color: tokens.button.tertiary.fg,
    ':active': {
      backgroundColor: tokens.button.tertiary['bg-pressed'],
      color: tokens.button.tertiary['fg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.tertiary['bg-disabled'],
      color: tokens.button.tertiary['fg-disabled'],
    },
  },
  negative: {
    backgroundColor: tokens.button.negative.bg,
    color: tokens.button.negative['fg-contrast'],
    ':active': {
      backgroundColor: tokens.button.negative['bg-pressed'],
      color: tokens.button.negative['fg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.negative['bg-disabled'],
      color: tokens.button.negative['fg-disabled'],
    },
  },
});

export const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = styleVariants({
  xlarge: {
    height: 64,
    padding: `${tokens.spacing[500]} ${tokens.spacing[400]}`,
    ...typography.base['text-m-semibold'],
  },
  large: {
    height: 56,
    padding: `${tokens.spacing[400]} ${tokens.spacing[300]}`,
    ...typography.base['text-s-semibold'],
  },
  medium: {
    height: 44,
    padding: `${tokens.spacing[200]} ${tokens.spacing[300]}`,
    ...typography.base['text-s-semibold'],
  },
  small: {
    height: 36,
    padding: `${tokens.spacing[200]} ${tokens.spacing[300]}`,
    ...typography.base['text-xs-semibold'],
  },
});

export const widthModeStyles: Record<NonNullable<ButtonProps['widthMode']>, string> = styleVariants({
  full: {
    width: '100%',
  },
});

/** spinner animation */
const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const spinnerStyle = style({
  width: 24,
  height: 24,
  border: '4px solid rgba(255, 255, 255, 0.4)',
  borderTop: '4px solid #FFFFFF',
  borderRadius: '50%',
  animation: `${spin} 1.2s linear infinite`,
});
