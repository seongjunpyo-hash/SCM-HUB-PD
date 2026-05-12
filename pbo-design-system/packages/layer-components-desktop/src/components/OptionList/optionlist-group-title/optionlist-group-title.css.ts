import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const optionListGroupTitleStyle = style({
  padding: `${tokens.spacing[150]} ${tokens.spacing[150]} 0`,
  color: tokens['fg-lower'],
  ...typography.base['text-s-medium'],
});
