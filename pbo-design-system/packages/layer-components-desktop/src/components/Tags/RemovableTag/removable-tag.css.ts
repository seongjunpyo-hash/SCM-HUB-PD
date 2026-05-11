import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const removableTagStyle = style({
  borderRadius: tokens.rounded.xs,

  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[100],
});

export const variantStyles = styleVariants({
  filled: {
    backgroundColor: tokens['bg-low'],
    color: tokens['fg-low'],
    selectors: {
      '&[aria-disabled="true"]': {
        backgroundColor: tokens['bg-disabled'],
        color: tokens['fg-disabled'],
      },
    },
  },
  outlined: {
    border: `1px solid ${tokens.stroke.border}`,
    backgroundColor: tokens.bg,
    color: tokens['fg-low'],
    selectors: {
      '&[aria-disabled="true"]': {
        backgroundColor: tokens['bg-disabled'],
        border: `1px solid ${tokens.stroke['border-disabled']}`,
        color: tokens['fg-disabled'],
      },
    },
  },
});

globalStyle(`${variantStyles.filled}:has(button:hover)`, {
  backgroundColor: tokens.tag.removable['bgFilled-hover'],
});

globalStyle(`${variantStyles.outlined}:has(button:hover)`, {
  backgroundColor: tokens.tag.filter['bg-hover'],
});

export const sizeStyles = styleVariants({
  small: {
    padding: `${tokens.spacing[100]} ${tokens.spacing[100]} ${tokens.spacing[100]} ${tokens.spacing[200]}`,
    ...typography.base['text-m-medium'],
  },
  large: {
    padding: `${tokens.spacing[300]} ${tokens.spacing[200]} ${tokens.spacing[300]} ${tokens.spacing[300]}`,
    ...typography.base['text-l-medium'],
  },
});

export const iconButtonStyle = style({
  display: 'flex',
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  color: tokens['fg-low'],
  cursor: 'pointer',

  selectors: {
    '&:disabled': {
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
  },
});
