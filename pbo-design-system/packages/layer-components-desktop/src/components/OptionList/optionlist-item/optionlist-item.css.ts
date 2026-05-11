import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const optionListItemStyle = style({
  padding: `${tokens.spacing[250]} ${tokens.spacing[150]}`,
  borderRadius: tokens.rounded.xxs,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.spacing[100],

  selectors: {
    '&[data-highlighted]': {
      backgroundColor: tokens.optionList['bg-optionItemHover'],
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: tokens.optionList['bg-optionItemHover'],
      outline: 'none',
    },
  },
});

export const flexStyle = style({
  flex: 1,
  minWidth: 0,

  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

export const textWrapStyle = style({
  flex: 1,
  minWidth: 0,

  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[50],
});

export const ellipsisStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
