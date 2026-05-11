import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const textfieldInputWrapStyle = style({
  width: '100%',
  height: 60,
  padding: tokens.spacing[400],
  borderRadius: tokens.rounded.xs,
  cursor: 'text',
  boxSizing: 'border-box',

  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[200],

  border: `1px solid ${tokens.textField.border}`,
  backgroundColor: tokens.textField.bg,

  selectors: {
    '&:focus-within': {
      borderColor: tokens.textField['border-active'],
    },
    '&:has(input[aria-invalid="true"])': {
      borderColor: tokens.stroke['border-critical'],
    },
    // readonly
    '&:has(input[readonly])': {
      borderColor: tokens.textField['border-disabled'],
      backgroundColor: tokens.textField['bg-disabled'],
      cursor: 'default',
    },
    // disabled
    '&:has(input[disabled])': {
      borderColor: tokens.textField['border-disabled'],
      backgroundColor: tokens.textField['bg-disabled'],
      cursor: 'not-allowed',
    },
  },
});

export const textfieldInputStyle = style({
  minWidth: 0,
  flex: 1,
  border: 'none',
  outline: 'none',
  padding: 0,
  backgroundColor: 'transparent',
  color: tokens.fg,
  ...typography.base['text-l-medium'],

  selectors: {
    '&::placeholder': {
      color: tokens.textField.placeholder,
    },
    '&:read-only': {
      cursor: 'default',
    },
    '&:disabled': {
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
  },
});

export const textfieldInputClearButtonStyle = style({
  cursor: 'pointer',
  display: 'none',

  selectors: {
    'input:not([readonly]):focus + &': {
      display: 'block',
    },
  },
});
