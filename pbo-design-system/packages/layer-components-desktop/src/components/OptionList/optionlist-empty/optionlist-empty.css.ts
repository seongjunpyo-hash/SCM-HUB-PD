import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const emptyStyle = style({
  padding: `${tokens.spacing[250]} ${tokens.spacing[150]}`,
  color: tokens['fg-disabled'],
  ...typography.base['text-l'],
});
