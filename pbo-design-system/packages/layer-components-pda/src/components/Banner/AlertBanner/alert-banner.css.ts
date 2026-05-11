import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

export const alertBannerStyle = style({
  borderRadius: tokens.rounded.xs,
  color: tokens.fg,
  border: '1px solid',

  display: 'flex',
  gap: tokens.spacing['150'],
  alignItems: 'center',
});

export const sizeStyles = styleVariants({
  small: {
    padding: '6px 8px',
    ...tokens.pda.banner['text-xxs-medium'],
  },
  medium: {
    padding: 8,
    ...typography.base['text-s-medium'],
  },
});

export const validationStateStyles = styleVariants({
  warning: {
    backgroundColor: tokens['bg-warning-low'],
    borderColor: tokens.stroke['border-warning-low'],
  },
  critical: {
    backgroundColor: tokens['bg-critical-low'],
    borderColor: tokens.stroke['border-critical-low'],
  },
  success: {
    backgroundColor: tokens['bg-success-low'],
    borderColor: tokens.stroke['border-success-low'],
  },
  accent: {
    backgroundColor: tokens.pda['bg-accent-low'],
    borderColor: tokens.pda['border-accent-low'],
  },
});
