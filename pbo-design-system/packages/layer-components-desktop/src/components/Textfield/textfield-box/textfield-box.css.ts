import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const textfieldBoxStyle = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: tokens.spacing[300],
  borderRadius: tokens.rounded.xs,
  backgroundColor: tokens.textField.bg,
  border: `1px solid ${tokens.textField.border}`,
  color: tokens.fg,
  ...typography.base['text-l'],

  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[200],

  selectors: {
    '&:hover': {
      borderColor: tokens.textField['border-hover'],
    },
    '&:focus-within': {
      outline: 'none',
      borderColor: tokens.textField['border-active'],
    },
    '&:has(input[aria-invalid="true"])': {
      borderColor: tokens.stroke['border-critical'],
    },
    // disabled
    '&:has(input[disabled])': {
      backgroundColor: tokens.textField['bg-disabled'],
      borderColor: tokens.textField['border-disabled'],
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
    // readonly
    '&:has(input[readonly])': {
      borderColor: tokens.textField['border-disabled'],
      backgroundColor: tokens.textField['bg-disabled'],
      cursor: 'default',
    },
  },
});
