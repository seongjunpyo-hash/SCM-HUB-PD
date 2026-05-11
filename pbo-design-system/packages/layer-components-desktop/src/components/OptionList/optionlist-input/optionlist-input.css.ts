import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const wrapStyle = style({
  padding: '6px 4px 6px 6px',
  borderRadius: tokens.rounded.xxs,

  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[250],
});

export const inputStyle = style({
  all: 'unset',
  flex: 1,

  ...typography.base['text-l'],
});

export const clearButtonStyle = style({
  cursor: 'pointer',
});
