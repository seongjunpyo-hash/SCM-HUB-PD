import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const tabBoxItemStyles = style({
  all: 'unset',
  boxSizing: 'border-box',
  cursor: 'pointer',
  color: tokens.fg,
  borderRadius: tokens.rounded.xs,

  whiteSpace: 'nowrap',
  transition: 'all 0.3s',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[50],

  selectors: {
    '&[data-state="active"]': {
      border: `1px solid ${tokens.stroke['border-strong']}`,
    },
    '&[data-state="inactive"]': {
      border: `1px solid ${tokens.stroke.border}`,
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&:hover': {
      backgroundColor: tokens.tab.box['bg-hover'],
    },
    '&:active': {
      backgroundColor: tokens.tab.box['bg-pressed'],
    },
    '&:disabled': {
      backgroundColor: tokens.tab.box['bg-disabled'],
      borderColor: tokens.tab.box['border-disabled'],
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
  },
});

export const sizeStyles = styleVariants({
  large: {
    padding: tokens.spacing[300],
    ...typography.base['text-l-medium'],
  },
  medium: {
    padding: `${tokens.spacing[200]} ${tokens.spacing[300]}`,
    ...typography.base['text-m-medium'],
  },
});
