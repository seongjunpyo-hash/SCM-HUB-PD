import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const textfieldInputStyle = style({
  all: 'unset',
  flex: 1,
  backgroundColor: 'transparent',

  selectors: {
    '&[type="number"]': {
      textAlign: 'right',
    },
    '&::placeholder': {
      color: tokens['fg-lower'],
    },
    // number type spin 제거
    '&[type="number"]::-webkit-outer-spin-button': {
      appearance: 'none',
    },
    '&[type="number"]::-webkit-inner-spin-button': {
      appearance: 'none',
    },
    // 자동완성 스타일 완전 제거
    '&:-webkit-autofill': {
      backgroundColor: 'transparent !important',
      transition: 'background-color 5000s ease-in-out 0s !important',
    },
  },
});

export const clearButtonStyle = style({
  cursor: 'pointer',
  display: 'none',

  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
    'input:not([readonly]):focus:not(:placeholder-shown) + &': {
      display: 'flex',
    },
  },
});

export const eyeButtonStyle = style({
  cursor: 'pointer',
  display: 'none',

  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
    'input:not([readonly]):focus + * + &': {
      display: 'flex',
    },
  },
});
