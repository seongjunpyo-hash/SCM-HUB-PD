import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const filterTagStyle = style({
  borderRadius: tokens.rounded.xs,
  backgroundColor: tokens.tag.filter.bg,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[100],

  selectors: {
    '&:disabled': {
      border: `1px solid ${tokens.tag.filter['border-disabled']}`,
      backgroundColor: tokens.tag.filter['bg-disalbed'],
      cursor: 'not-allowed',
      color: tokens['fg-disabled'],
    },
    '&:hover': {
      backgroundColor: tokens.tag.filter['bg-hover'],
    },
    '&:active': {
      backgroundColor: tokens.tag.filter['bg-pressed'],
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
  },
});

export const unSelectedSizeStyles = recipe({
  base: {
    border: `1px solid ${tokens.tag.filter.border}`,
    color: tokens['fg-lower'],
  },
  variants: {
    size: {
      medium: {
        padding: `${tokens.spacing[200]} ${tokens.spacing[300]}`,
        ...typography.base['text-m-medium'],
      },
      large: {
        padding: tokens.spacing[300],
        ...typography.base['text-l-medium'],
      },
    },
  },
});

export const selectedSizeStyles = recipe({
  base: {
    border: `1px solid ${tokens.tag.filter['border-selected']}`,
    color: tokens.fg,
  },
  variants: {
    size: {
      medium: {
        padding: `${tokens.spacing[200]} ${tokens.spacing[300]} ${tokens.spacing[200]} ${tokens.spacing[100]}`,
        ...typography.base['text-m-medium'],
      },
      large: {
        padding: `${tokens.spacing[300]} ${tokens.spacing[300]} ${tokens.spacing[300]} ${tokens.spacing[250]}`,
        ...typography.base['text-l-medium'],
      },
    },
  },
});
