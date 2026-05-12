import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

import type { DialogProps } from '../dialog.types';

export const dialogTitleStyle = style({
  padding: `0 ${tokens.spacing[500]}`,
  ...typography.base['title-xl-medium'],
});

export const typeStyles: Record<NonNullable<DialogProps['type']>, string> = styleVariants({
  default: {
    color: tokens.fg,
  },
  failFeedback: {
    color: tokens['fg-critical'],
  },
});
