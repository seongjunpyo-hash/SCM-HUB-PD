import { tokens } from '@musinsa/layer-tokens/desktop';
import { styleVariants } from '@vanilla-extract/css';

export const secondaryVariantStyles = styleVariants({
  filled: {
    backgroundColor: tokens.button.secondary.bg,
    color: tokens.button.secondary.fg,
    ':hover': {
      backgroundColor: tokens.button.secondary['bg-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.secondary['bg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.secondary['bg-disabled'],
      color: tokens.button.secondary['fg-disabled'],
    },
  },
  outlined: {
    backgroundColor: tokens.button.secondary.bgOutlined,
    color: tokens.button.secondary.fg,
    border: `1px solid ${tokens.button.secondary.border}`,
    ':hover': {
      backgroundColor: tokens.button.secondary['bgOutlined-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.secondary['bgOutlined-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.secondary['bg-disabled'],
      color: tokens.button.secondary['fg-disabled'],
      border: 'none',
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.secondary['fg-low'],
    ':hover': {
      backgroundColor: tokens.button.secondary['bgGhost-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.secondary['bgGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.button.secondary['fg-disabled'],
    },
  },
});
