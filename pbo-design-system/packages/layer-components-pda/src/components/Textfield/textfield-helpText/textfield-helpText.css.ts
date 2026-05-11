import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const textfieldHelpTextStyle = style({
  ...typography.base['text-xs-medium'],
  color: tokens['fg-lower'],

  selectors: {
    'div:has(input[aria-invalid="true"]) + &': {
      color: tokens['fg-critical'],
    },
  },
});
