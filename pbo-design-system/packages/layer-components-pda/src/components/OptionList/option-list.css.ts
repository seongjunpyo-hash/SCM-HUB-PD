import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

import type { OptionListProps } from './option-list.types';

export const optionListStyle = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: `${tokens.spacing[300]} ${tokens.spacing[500]}`,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  selectors: {
    '&:active:not([aria-disabled="true"])': {
      backgroundColor: tokens['bg-low'],
    },
    '&[aria-selected="true"]': {
      color: tokens.pda['fg-accent'],
    },
    '&[aria-disabled="true"]': {
      cursor: 'not-allowed',
      color: tokens['fg-disabled'],
    },
  },
});

export const typeStyles: Record<NonNullable<OptionListProps['type']>, string> = styleVariants({
  default: {
    ...typography.base['text-xl-medium'],
  },
  code: {
    ...typography.mono['text-m-medium'],
  },
});
