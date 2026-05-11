import { tokens } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const checkboxRootStyle = style({
  all: 'unset',
  borderRadius: tokens.rounded.xs,
  boxSizing: 'border-box',
  backgroundColor: tokens.control['bg'],
  border: `1px solid ${tokens.stroke.border}`,
  cursor: 'pointer',

  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&[aria-invalid="true"]': {
      borderColor: tokens.stroke['border-critical'],
    },
    // checked case
    '&[data-state="checked"]': {
      backgroundColor: tokens.control['bg-checked'],
      border: 'none',
    },
    '&[data-state="checked"]:hover': {
      backgroundColor: tokens.control['bg-checkedHover'],
    },
    '&[data-state="checked"]:active': {
      backgroundColor: tokens.control['bg-checkedPressed'],
    },
    '&[data-state="checked"]:disabled': {
      backgroundColor: tokens.control['bg-checkedDisabled'],
      cursor: 'not-allowed',
    },
    // unchecked case
    '&[data-state="unchecked"]:hover': {
      backgroundColor: tokens.control['bg-hover'],
    },
    '&[data-state="unchecked"]:active': {
      backgroundColor: tokens.control['bg-pressed'],
    },
    '&[data-state="unchecked"]:disabled': {
      backgroundColor: tokens.control['bg-disabled'],
      cursor: 'not-allowed',
    },
  },
});

export const sizeStyles = styleVariants({
  small: {
    width: 16,
    height: 16,
  },
  medium: {
    width: 24,
    height: 24,
  },
});

export const indicatorStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
