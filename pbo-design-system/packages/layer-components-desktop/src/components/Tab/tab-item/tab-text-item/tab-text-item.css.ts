import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const tabTextItemStyles = style({
  all: 'unset',
  padding: `0 ${tokens.spacing[50]}`,
  boxSizing: 'border-box',
  cursor: 'pointer',

  whiteSpace: 'nowrap',
  transition: 'all 0.3s',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[100],

  selectors: {
    '&[data-state="active"]': {
      color: tokens.fg,
    },
    '&[data-state="inactive"]': {
      color: tokens['fg-lower'],
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&:hover': {
      backgroundColor: tokens.tab.text['bg-hover'],
    },
    '&:active': {
      backgroundColor: tokens.tab.text['bg-pressed'],
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
  },
});

export const sizeStyles = styleVariants({
  large: {
    ...typography.base['text-m-semibold'],
  },
  medium: {
    ...typography.base['text-s-semibold'],
  },
});
