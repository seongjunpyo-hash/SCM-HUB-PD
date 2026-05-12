import { tokens } from '@musinsa/layer-tokens/desktop';
import { styleVariants } from '@vanilla-extract/css';

export const primaryVariantStyles = styleVariants({
  filled: {
    backgroundColor: tokens.button.primary.bg,
    color: tokens.button.primary['fg-contrast'],
    ':hover': {
      backgroundColor: tokens.button.primary['bg-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.primary['bg-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.primary['bg-disabled'],
      color: tokens.button.primary['fg-disabled'],
    },
  },
  accentFilled: {
    backgroundColor: tokens.layerDesktop['bg-accent'],
    color: tokens.button.primary['fg-contrast'],
    ':hover': {
      backgroundColor: tokens.button.primary['bgAccent-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.primary['bgAccent-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.primary['bg-disabled'],
      color: tokens.button.primary['fg-disabled'],
    },
  },
  outlined: {
    backgroundColor: tokens.button.primary.bgOutlined,
    color: tokens.button.primary.fg,
    border: `1px solid ${tokens.button.primary.border}`,
    ':hover': {
      backgroundColor: tokens.button.primary['bgOutlined-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.primary['bgOutlined-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.primary['bg-disabled'],
      color: tokens.button.primary['fg-disabled'],
      border: 'none',
    },
  },
  accentOutlined: {
    backgroundColor: tokens.button.primary.bgOutlined,
    color: tokens.layerDesktop['fg-accent'],
    border: `1px solid ${tokens.layerDesktop['border-accent']}`,
    ':hover': {
      backgroundColor: tokens.button.primary['bgAccentOutlined-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.primary['bgAccentOutlined-pressed'],
    },
    ':disabled': {
      backgroundColor: tokens.button.primary['bg-disabled'],
      color: tokens.button.primary['fg-disabled'],
      border: 'none',
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.primary.fg,
    ':hover': {
      backgroundColor: tokens.button.primary['bgGhost-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.primary['bgGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.button.primary['fg-disabled'],
    },
  },
  accentGhost: {
    backgroundColor: 'transparent',
    color: tokens.layerDesktop['fg-accent'],
    ':hover': {
      backgroundColor: tokens.button.primary['bgAccentGhost-hover'],
    },
    ':active': {
      backgroundColor: tokens.button.primary['bgAccentGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.button.primary['fg-disabled'],
    },
  },
});
