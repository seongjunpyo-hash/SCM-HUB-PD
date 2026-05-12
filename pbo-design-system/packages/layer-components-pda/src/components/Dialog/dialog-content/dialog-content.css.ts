import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const dialogContentStyle = style({
  marginTop: tokens.spacing[800],
  marginBottom: tokens.spacing[1000],
  padding: `0 ${tokens.spacing[500]}`,
});
