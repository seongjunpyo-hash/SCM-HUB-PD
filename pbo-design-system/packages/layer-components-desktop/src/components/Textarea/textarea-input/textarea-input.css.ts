import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const textareaInputStyle = style({
  flex: 1,
  width: '100%',
  boxSizing: 'border-box',
  color: tokens.fg,
  border: 'none',
  backgroundColor: 'transparent',
  ...typography.base['text-l'],

  resize: 'none',

  selectors: {
    '&:focus': {
      outline: 'none',
    },
    '&::placeholder': {
      color: tokens['fg-lower'],
    },
  },
});
