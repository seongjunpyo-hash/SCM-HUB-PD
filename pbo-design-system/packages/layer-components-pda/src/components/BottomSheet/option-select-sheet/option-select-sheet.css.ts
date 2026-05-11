import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const optionSelectSheetStyle = style({
  backgroundColor: tokens.bg,

  display: 'flex',
  flexDirection: 'column',

  position: 'fixed',
  width: '100%',
  bottom: 0,
  left: 0,
  transition: 'max-height 0.3s ease-out',
});

export const topNavStyle = style({
  padding: `${tokens.spacing[300]} ${tokens.spacing[500]}`,

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: tokens.spacing[300],
});

export const childWrapStyle = style({
  overflowY: 'auto',
});
