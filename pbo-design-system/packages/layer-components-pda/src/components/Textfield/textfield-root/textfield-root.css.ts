import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const textfieldRootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[200],
});
