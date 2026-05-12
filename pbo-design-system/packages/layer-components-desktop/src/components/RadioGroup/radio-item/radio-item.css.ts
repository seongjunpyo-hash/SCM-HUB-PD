import { tokens } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const itemStyle = style({
  margin: 0,
  appearance: 'none',
  WebkitAppearance: 'none',
  boxSizing: 'border-box',

  backgroundColor: tokens.control['bg'],
  border: `1px solid ${tokens.control.border}`,
  borderRadius: tokens.rounded.full,
  cursor: 'pointer',
  position: 'relative',

  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&[aria-invalid="true"]': {
      borderColor: tokens.stroke['border-critical'],
    },
    // unchecked case
    '&:hover': {
      backgroundColor: tokens.control['bg-hover'],
    },
    '&:active': {
      backgroundColor: tokens.control['bg-pressed'],
    },
    '&:disabled': {
      backgroundColor: tokens.control['bg-disabled'],
      borderColor: tokens.control['border-disabled'],
      cursor: 'not-allowed',
    },
    // checked case
    '&[data-state="checked"]': {
      backgroundColor: tokens.control['bg-checked'],
      borderColor: tokens.control['bg-checked'],
    },
    '&[data-state="checked"]:hover': {
      backgroundColor: tokens.control['bg-checkedHover'],
    },
    '&[data-state="checked"]:active': {
      backgroundColor: tokens.control['bg-checkedPressed'],
    },
    '&[data-state="checked"]:disabled': {
      backgroundColor: tokens.control['bg-checkedDisabled'],
      borderColor: tokens.control['bg-checkedDisabled'],
      cursor: 'not-allowed',
    },
  },
});

export const itemSizeStyles = styleVariants({
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
  selectors: {
    '&::after': {
      content: '',
      borderRadius: tokens.rounded.full,
      backgroundColor: tokens.control.indicator['bg-checked'],

      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
});

export const indicatorSizeStyles = styleVariants({
  small: {
    selectors: {
      '&::after': {
        width: 8,
        height: 8,
      },
    },
  },
  medium: {
    selectors: {
      '&::after': {
        width: 10,
        height: 10,
      },
    },
  },
});
