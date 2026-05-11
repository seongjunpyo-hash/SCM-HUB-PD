import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const cardStyle = style({
  width: '100%',
  padding: tokens.spacing[200],
  backgroundColor: tokens.pda.card.bg,
  textAlign: 'center',

  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[100],
});
