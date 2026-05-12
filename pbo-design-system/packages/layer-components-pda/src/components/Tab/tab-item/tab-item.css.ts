import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

export const tabItemStyles = style({
  all: 'unset',
  padding: `${tokens.spacing[250]} ${tokens.spacing[200]} ${tokens.spacing[300]}`,
  boxSizing: 'border-box',
  cursor: 'pointer',

  ...typography.base['text-s-medium'],

  whiteSpace: 'nowrap',
  transition: 'all 0.3s',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  selectors: {
    '&[data-state="active"]': {
      color: tokens.fg,
      boxShadow: `inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor;`,
    },
    '&[data-state="inactive"]': {
      color: tokens.tab['fg-off'],
    },
  },
});

export const widthModeStyles = styleVariants({
  hug: {},
  fill: {
    flex: 1,
  },
});
