import { tokens } from '@musinsa/layer-tokens/desktop';
import { styleVariants } from '@vanilla-extract/css';

export const negativeVariantStyles = styleVariants({
  filled: {
    backgroundColor: tokens.button.negative.bg,
    color: tokens.button.negative['fg-contrast'],
    ':hover': {
      backgroundColor: tokens.button.negative['bg-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.negative['bg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.negative['bg-disabled'],
      color: tokens.button.negative['fg-disabled'],
    },
  },
  outlined: {
    backgroundColor: tokens.button.negative.bgOutlined,
    color: tokens.button.negative.fg,
    border: `1px solid ${tokens.button.negative.border}`,
    ':hover': {
      backgroundColor: tokens.button.negative['bgOutlined-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.negative['bgOutlined-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.negative['bg-disabled'],
      color: tokens.button.negative['fg-disabled'],
      border: 'none',
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.negative.fg,
    ':hover': {
      backgroundColor: tokens.button.negative['bgGhost-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.negative['bgGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.button.negative['fg-disabled'],
    },
  },
});
