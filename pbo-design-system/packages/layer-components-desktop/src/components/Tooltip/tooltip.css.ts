import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const tooltipContentStyle = style({
  padding: 8,
  zIndex: 9999,
  borderRadius: tokens.rounded.xs,
  whiteSpace: 'nowrap',
  ...typography.base['text-m'],
});

export const variantStyles = styleVariants({
  black: {
    backgroundColor: tokens.tooltip.black.bg,
    color: tokens['fg-inverse'],
  },
  white: {
    backgroundColor: tokens.tooltip.white.bg,
    color: tokens['fg-onInverse'],
  },
});

export const arrowStartStyle = style({});
