import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const countInputWrapStyle = style({
  width: '100%',
  height: 60,
  padding: `${tokens.spacing[300]} ${tokens.spacing[400]}`,
  borderRadius: tokens.rounded.xs,
  cursor: 'text',
  border: `1px solid ${tokens.textField.border}`,
  backgroundColor: tokens.textField.bg,
  boxSizing: 'border-box',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  position: 'relative',

  selectors: {
    '&:focus-within': {
      borderColor: tokens.textField['border-active'],
    },
    '&:has(input[aria-invalid="true"])': {
      borderColor: tokens.stroke['border-critical'],
    },
    '&::placeholder': {
      color: tokens.textField.placeholder,
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

export const countInputStyle = recipe({
  base: {
    border: 'none',
    outline: 'none',
    padding: 0,
    backgroundColor: 'transparent',
    textAlign: 'right',
    ...typography.base['text-xl-medium'],

    width: 'calc(50% - 28px)', // left-padding(16px) + gap(12px)
    position: 'absolute',
    right: 'calc(50% + 12px)',

    selectors: {
      '&::placeholder': {
        color: tokens.textField.placeholder,
      },
      '&[aria-invalid="true"]': {
        color: tokens.stroke['border-critical'],
      },
      '&[aria-invalid="true"]::placeholder': {
        color: tokens.stroke['border-critical'],
      },
      '&:read-only': {
        cursor: 'default',
      },
      '&:disabled': {
        color: tokens['fg-disabled'],
        cursor: 'not-allowed',
      },
      '&:disabled::placeholder': {
        color: tokens['fg-disabled'],
      },
    },
  },
  variants: {
    valueAccent: {
      true: {
        color: tokens.pda['fg-accent'],
      },
      false: {
        color: tokens['fg-neutral'],
      },
    },
  },
});

export const countInputTotalCountStyle = style({
  position: 'absolute',
  left: 'calc(50% + 12px)',
});
