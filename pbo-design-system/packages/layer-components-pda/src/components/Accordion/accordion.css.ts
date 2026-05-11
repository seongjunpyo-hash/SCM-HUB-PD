import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const accordionStyle = style({
  padding: `${tokens.spacing[300]} ${tokens.spacing[500]}`,
  cursor: 'pointer',

  display: 'flex',
  gap: tokens.spacing[400],
  alignItems: 'center',

  selectors: {
    '&[aria-disabled="true"]': {
      cursor: 'not-allowed',
    },
    '&:active:not([aria-disabled="true"])': {
      backgroundColor: tokens['bg-low'],
    },
  },
});

export const leftStyle = style({
  flex: 1,
  display: 'flex',
  gap: tokens.spacing[100],
  alignItems: 'center',
});
