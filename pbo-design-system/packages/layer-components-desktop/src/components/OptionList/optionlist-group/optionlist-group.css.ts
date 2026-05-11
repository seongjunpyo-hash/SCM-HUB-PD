import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const optionListGroupStyle = style({
  padding: tokens.spacing[150],

  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[50],

  selectors: {
    '&:not(:first-child)': {
      borderTop: `1px solid ${tokens.optionList.border}`,
    },
  },
});
