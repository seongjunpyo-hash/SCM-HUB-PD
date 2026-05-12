import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const checkboxLabelStyle = style({
  ...typography.base['text-l-medium'],
  color: tokens.fg,

  selectors: {
    'button:disabled + &': {
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
  },
});
