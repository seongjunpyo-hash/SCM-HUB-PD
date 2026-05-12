import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

import type { TagProps } from './tag.types';

export const tagStyle = style({
  width: 'fit-content',
  padding: `${tokens.spacing[100]} ${tokens.spacing[200]}`,
  ...typography.base['text-xs-medium'],
  borderRadius: tokens.rounded.xs,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: tokens.spacing[100],
});

export const stateTypeStyles: Record<NonNullable<TagProps['stateType']>, string> = styleVariants({
  default: {
    color: tokens['fg-lower'],
    backgroundColor: tokens.tag.status.bg,
  },
  neutral: {
    color: tokens['fg-neutral'],
    backgroundColor: tokens.tag.status.bg,
  },
  accent: {
    color: tokens.pda['fg-accent'],
    backgroundColor: tokens.primitive.color.blue.alpha500[10],
  },
  critical: {
    color: tokens['fg-critical'],
    backgroundColor: tokens.tag.status['bg-critical'],
  },
});
