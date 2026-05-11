import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const dialogSubTitleStyle = style({
  padding: `0 ${tokens.spacing[500]}`,
  marginTop: tokens.spacing[300],
  color: tokens['fg-low'],
  ...typography.base['text-s'],
});
