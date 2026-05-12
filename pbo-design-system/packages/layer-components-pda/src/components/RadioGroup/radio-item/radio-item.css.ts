import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const itemStyle = style({
  margin: 0,
  appearance: 'none',
  WebkitAppearance: 'none',
  boxSizing: 'border-box',
  width: 28,
  height: 28,

  backgroundColor: tokens.control['bg'],
  border: `1px solid ${tokens.control.border}`,
  borderRadius: tokens.rounded.full,
  cursor: 'pointer',
  position: 'relative',

  selectors: {
    // unchecked case
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

export const indicatorStyle = style({
  selectors: {
    '&::after': {
      content: '',
      width: 12,
      height: 12,
      borderRadius: tokens.rounded.full,
      backgroundColor: tokens.control.indicator['bg-checked'],

      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
});
