import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const triggerStyle = style({
  all: 'unset',
  width: '100%',
  height: 44,
  boxSizing: 'border-box',
  padding: `0 ${tokens.spacing[300]}`,
  borderRadius: tokens.rounded.xs,
  border: `1px solid ${tokens.stroke.border}`,
  cursor: 'pointer',
  color: tokens.fg,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.spacing[100],

  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&:hover:not([data-disabled])': {
      borderColor: tokens.select['border-hover'],
    },
    '&[aria-invalid="true"]': {
      borderColor: tokens.stroke['border-critical'],
    },
    '&[data-state="open"]': {
      borderColor: tokens.select['border-active'],
    },
    '&[data-placeholder]': {
      color: tokens['fg-lower'],
    },
    '&[aria-disabled="true"]': {
      cursor: 'not-allowed',
      backgroundColor: tokens.select['bg-disabled'],
    },
    '&[aria-readonly="true"]': {
      cursor: 'default',
      backgroundColor: tokens.select['bg-disabled'],
    },
  },
});

export const chvronDownStyle = style({
  selectors: {
    '[data-state="open"] &': {
      transform: 'rotate(180deg)',
    },
  },
});

export const clearButtonStyle = style({
  display: 'flex',

  selectors: {
    'button[data-placeholder] &': {
      display: 'none !important',
    },
    'button[data-disabled] &': {
      display: 'none !important',
    },
  },
});
