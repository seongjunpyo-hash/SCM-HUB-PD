import { tokens } from '@musinsa/layer-tokens/pda';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapStyle = style({
  display: 'flex',
  borderRadius: tokens.rounded.xs,
  border: `1px solid ${tokens.stepper.border}`,
  backgroundColor: tokens.textField.bg,

  selectors: {
    // readonly, disabled, error 제외
    '&:focus-within:not(:has(input[readonly])):not(:has(input[disabled])):not(:has(input[aria-invalid="true"]))': {
      borderColor: tokens.textField['border-active'],
    },
    '&:has(input[aria-invalid="true"])': {
      borderColor: tokens.stroke['border-critical'],
    },
    '&:has(input[readonly])': {
      borderColor: tokens.pda.stepper['border-disabled'],
    },
    '&:has(input[disabled])': {
      borderColor: tokens.pda.stepper['border-disabled'],
    },
  },
});

// CountInput Wrap border 초기화
globalStyle(`${wrapStyle} > div`, {
  borderRadius: 0,
  borderTop: 'none',
  borderBottom: 'none',
});
globalStyle(`${wrapStyle}:focus-within > div`, {
  borderColor: tokens.textField['border-active'],
});

export const buttonStyle = style({
  minWidth: 60,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  selectors: {
    '&:disabled': {
      backgroundColor: tokens.pda.stepper['bg-disabled'],
      cursor: 'not-allowed',
    },
    [`${wrapStyle}:has(input[readonly]) &`]: {
      backgroundColor: tokens.pda.stepper['bg-disabled'],
      cursor: 'default',
    },
    [`${wrapStyle}:has(input[disabled]) &`]: {
      backgroundColor: tokens.pda.stepper['bg-disabled'],
      cursor: 'not-allowed',
    },
  },
});
