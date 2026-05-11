import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const stepperRootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[200],
});
