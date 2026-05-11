import { tokens } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const iconButtonStyle = style({
  all: 'unset',
  width: 'fit-content',
  boxSizing: 'border-box',
  borderRadius: tokens.rounded.xs,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
  },
});

export const sizeStyles = styleVariants({
  xlarge: {
    width: 52,
    height: 52,
    padding: 12,
  },
  large: {
    width: 44,
    height: 44,
    padding: 10,
  },
  medium: {
    width: 40,
    height: 40,
    padding: 8,
  },
  small: {
    width: 36,
    height: 36,
    padding: 8,
  },
  xsmall: {
    width: 32,
    height: 32,
    padding: 6,
  },
  '2xsmall': {
    width: 24,
    height: 24,
    padding: 2,
  },
});

export const primaryStyles = styleVariants({
  filled: {
    backgroundColor: tokens.button.primary.bg,
    color: tokens.button.primary['fg-contrast'],
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.primary['bg-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.primary['bg-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.primary['bg-disabled'],
        color: tokens.button.primary['fg-disabled'],
      },
    },
  },
  accentFilled: {
    backgroundColor: tokens.layerDesktop['bg-accent'],
    color: tokens.button.primary['fg-contrast'],
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.primary['bgAccent-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.primary['bgAccent-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.primary['bg-disabled'],
        color: tokens.button.primary['fg-disabled'],
      },
    },
  },
  outlined: {
    backgroundColor: tokens.button.primary.bgOutlined,
    color: tokens.button.primary.fg,
    border: `1px solid ${tokens.button.primary.border}`,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.primary['bgOutlined-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.primary['bgOutlined-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.primary['bg-disabled'],
        color: tokens.button.primary['fg-disabled'],
        border: 'none',
      },
    },
  },
  accentOutlined: {
    backgroundColor: tokens.button.primary.bgOutlined,
    color: tokens.layerDesktop['fg-accent'],
    border: `1px solid ${tokens.layerDesktop['border-accent']}`,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.primary['bgAccentOutlined-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.primary['bgAccentOutlined-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.primary['bg-disabled'],
        color: tokens.button.primary['fg-disabled'],
        border: 'none',
      },
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.primary.fg,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.primary['bgGhost-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.primary['bgGhost-pressed'],
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: tokens.button.primary['fg-disabled'],
      },
    },
  },
  accentGhost: {
    backgroundColor: 'transparent',
    color: tokens.layerDesktop['fg-accent'],
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.primary['bgAccentGhost-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.primary['bgAccentGhost-pressed'],
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: tokens.button.primary['fg-disabled'],
      },
    },
  },
});

export const secondaryStyles = styleVariants({
  filled: {
    backgroundColor: tokens.button.secondary.bg,
    color: tokens.button.secondary.fg,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.secondary['bg-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.secondary['bg-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.secondary['bg-disabled'],
        color: tokens.button.secondary['fg-disabled'],
      },
    },
  },
  outlined: {
    backgroundColor: tokens.button.secondary.bgOutlined,
    color: tokens.button.secondary.fg,
    border: `1px solid ${tokens.button.secondary.border}`,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.secondary['bgOutlined-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.secondary['bgOutlined-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.secondary['bgOutlined-disabled'],
        color: tokens.button.secondary['fg-disabled'],
        border: 'none',
      },
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.secondary['fg-low'],
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.secondary['bgGhost-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.secondary['bgGhost-pressed'],
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: tokens.button.secondary['fg-disabled'],
      },
    },
  },
});

export const tertiaryStyles = styleVariants({
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.tertiary.fg,
    selectors: {
      '&:hover': {
        color: tokens.button.tertiary['fg-hover'],
      },
      '&:active': {
        color: tokens.button.tertiary['fg-pressed'],
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: tokens.button.tertiary['fg-disabled'],
      },
    },
  },
});

export const negativeStyles = styleVariants({
  filled: {
    backgroundColor: tokens.button.negative.bg,
    color: tokens.button.negative['fg-contrast'],
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.negative['bg-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.negative['bg-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.negative['bg-disabled'],
        color: tokens.button.negative['fg-disabled'],
      },
    },
  },
  outlined: {
    backgroundColor: tokens.button.negative.bgOutlined,
    color: tokens.button.negative.fg,
    border: `1px solid ${tokens.button.negative.border}`,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.negative['bgOutlined-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.negative['bgOutlined-pressed'],
      },
      '&:disabled': {
        backgroundColor: tokens.button.negative['bgOutlined-disabled'],
        color: tokens.button.negative['fg-disabled'],
        border: 'none',
      },
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.button.negative.fg,
    selectors: {
      '&:hover': {
        backgroundColor: tokens.button.negative['bgGhost-hover'],
      },
      '&:active': {
        backgroundColor: tokens.button.negative['bgGhost-pressed'],
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: tokens.button.negative['fg-disabled'],
      },
    },
  },
});
