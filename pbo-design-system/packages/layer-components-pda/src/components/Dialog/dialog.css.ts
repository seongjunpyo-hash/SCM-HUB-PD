import { tokens } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

import type { DialogProps } from './dialog.types';

export const dialogStyle = style({
  width: 'calc(100% - 40px)',
  backgroundColor: tokens.bg,
  textAlign: 'center',

  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

export const typeStyles: Record<NonNullable<DialogProps['type']>, string> = styleVariants({
  default: {
    paddingTop: tokens.spacing[1000],
  },
  failFeedback: {
    paddingTop: tokens.spacing[800],
  },
});

export const iconStyle = style({
  marginBottom: tokens.spacing[600],
});
