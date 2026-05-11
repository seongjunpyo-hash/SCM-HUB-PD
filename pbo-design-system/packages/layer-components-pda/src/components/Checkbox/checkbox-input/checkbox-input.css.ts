import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const checkboxRootStyle = style({
  all: 'unset',
  width: 24,
  height: 24,
  borderRadius: tokens.rounded.xs,
  boxSizing: 'border-box',
  backgroundColor: tokens.control['bg'],
  border: `1px solid ${tokens.stroke.border}`,
  cursor: 'pointer',

  selectors: {
    // checked case
    '&[data-state="checked"]': {
      backgroundColor: tokens.control['bg-checked'],
      border: 'none',
    },
    '&[data-state="checked"]:active': {
      backgroundColor: tokens.control['bg-checkedPressed'],
    },
    '&[data-state="checked"]:disabled': {
      backgroundColor: tokens.control['bg-checkedDisabled'],
      cursor: 'not-allowed',
    },
    // unchecked case
    '&[data-state="unchecked"]:active': {
      backgroundColor: tokens.control['bg-pressed'],
    },
    '&[data-state="unchecked"]:disabled': {
      backgroundColor: tokens.control['bg-disabled'],
      cursor: 'not-allowed',
    },
  },
});

export const indicatorStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
