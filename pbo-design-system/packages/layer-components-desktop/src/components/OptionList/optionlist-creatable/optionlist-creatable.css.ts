import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const creatableStyle = style({
  all: 'unset',
  padding: `${tokens.spacing[250]} ${tokens.spacing[150]}`,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[250],

  selectors: {
    '&:hover': {
      backgroundColor: tokens.optionList['bg-optionItemHover'],
    },
  },
});

export const textWrapStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[100],
});
