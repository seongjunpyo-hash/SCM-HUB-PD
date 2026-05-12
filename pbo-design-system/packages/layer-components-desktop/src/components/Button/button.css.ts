import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const buttonStyle = style({
  width: 'fit-content',
  border: 'none',
  background: 'none',
  boxSizing: 'border-box',
  borderRadius: tokens.rounded.xs,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[100],

  ':disabled': {
    cursor: 'not-allowed',
  },
  // focus는 공통
  ':focus-visible': {
    outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
    outlineOffset: 1,
  },
});

export const sizeStyles = recipe({
  base: {},
  variants: {
    size: {
      xlarge: {
        height: 52,
        padding: `${tokens.spacing[400]} ${tokens.spacing[300]}`,
        ...typography.base['text-l-medium'],
      },
      large: {
        height: 44,
        padding: tokens.spacing[300],
        ...typography.base['text-l-medium'],
      },
      medium: {
        height: 40,
        padding: `${tokens.spacing[250]} ${tokens.spacing[300]}`,
        ...typography.base['text-m-medium'],
      },
      small: {
        height: 36,
        padding: `${tokens.spacing[200]} ${tokens.spacing[300]}`,
        ...typography.base['text-m-medium'],
      },
      xsmall: {
        height: 32,
        padding: `${tokens.spacing[150]} ${tokens.spacing[250]}`,
        ...typography.base['text-s'],
      },
    },
    widthMode: {
      default: {},
      compact: {},
    },
  },
  compoundVariants: [
    {
      variants: { size: 'xlarge', widthMode: 'default' },
      style: { minWidth: 80 },
    },
    {
      variants: { size: 'large', widthMode: 'default' },
      style: { minWidth: 80 },
    },
    {
      variants: { size: 'medium', widthMode: 'default' },
      style: { minWidth: 80 },
    },
    {
      variants: { size: 'small', widthMode: 'default' },
      style: { minWidth: 64 },
    },
    {
      variants: { size: 'xsmall', widthMode: 'default' },
      style: { minWidth: 64 },
    },
    {
      variants: { size: 'xlarge', widthMode: 'compact' },
      style: { minWidth: 64 },
    },
    {
      variants: { size: 'large', widthMode: 'compact' },
      style: { minWidth: 56 },
    },
    {
      variants: { size: 'medium', widthMode: 'compact' },
      style: { minWidth: 56 },
    },
    {
      variants: { size: 'small', widthMode: 'compact' },
      style: { minWidth: 48 },
    },
    {
      variants: { size: 'xsmall', widthMode: 'compact' },
      style: { minWidth: 40 },
    },
  ],
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
  width: 12,
  height: 12,
  border: '2px solid rgba(255, 255, 255, 0.4)',
  borderTop: '2px solid #FFFFFF',
  borderRadius: '50%',
  animation: `${spin} 1.2s linear infinite`,
});
