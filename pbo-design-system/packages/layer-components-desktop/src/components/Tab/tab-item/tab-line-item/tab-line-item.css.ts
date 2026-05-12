import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const tabLineItemStyles = style({
  all: 'unset',
  padding: `${tokens.spacing[300]} ${tokens.spacing[50]}`,
  boxSizing: 'border-box',
  cursor: 'pointer',

  whiteSpace: 'nowrap',
  transition: 'all 0.3s',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[50],

  selectors: {
    '&[data-state="active"]': {
      color: tokens.layerDesktop['fg-accent'],
      boxShadow: `inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor;`,
    },
    '&[data-state="inactive"]': {
      color: tokens['fg-lower'],
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&:hover': {
      backgroundColor: tokens.tab.line['bg-hover'],
    },
    '&:active': {
      backgroundColor: tokens.tab.line['bg-pressed'],
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
    ...typography.base['title-s-semibold'],
  },
  medium: {
    ...typography.base['text-xl-semibold'],
  },
});
