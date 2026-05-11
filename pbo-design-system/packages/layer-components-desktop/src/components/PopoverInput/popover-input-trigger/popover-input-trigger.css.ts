import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const triggerStyle = style({
  all: 'unset',
  width: '100%',
  boxSizing: 'border-box',
  padding: `0 ${tokens.spacing[300]}`,
  borderRadius: tokens.rounded.xs,
  border: `1px solid ${tokens.stroke.border}`,
  cursor: 'pointer',

  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.spacing[100],

  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&:hover:not([data-disabled])': {
      borderColor: tokens.select['border-hover'],
    },
    '&[aria-invalid="true"]': {
      borderColor: tokens.stroke['border-critical'],
    },
    '&[aria-readonly="true"]': {
      cursor: 'default',
      backgroundColor: tokens.select['bg-disabled'],
    },
    '&[data-disabled]': {
      cursor: 'not-allowed',
      backgroundColor: tokens.select['bg-disabled'],
    },
    '&[data-state="open"]': {
      borderColor: tokens.select['border-active'],
    },
  },
});

export const sizeStyles = styleVariants({
  medium: {
    height: 44,
    ...typography.base['text-l'],
  },
  small: {
    height: 36,
    ...typography.base['text-m'],
  },
});

export const displayValueStyle = style({
  width: 0,
  flex: 1,

  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  color: tokens.fg,

  selectors: {
    'button[data-placeholder] &': {
      color: tokens['fg-lower'],
    },
    'button[data-display-floating-label] &': {
      opacity: 0,
    },
    // floatingLabel이 있을떈 focus-visible, open이거나 displayValue상태에서만 노출
    'button:focus-visible &': {
      opacity: 1,
    },
    'button[data-display-floating-label][data-state="open"] &': {
      opacity: 1,
    },
    'button[data-display-floating-label]:not([data-placeholder]) &': {
      opacity: 1,
    },
  },
});

export const floatingLabelStyle = recipe({
  base: {
    color: tokens['fg-lower'],
    padding: `0 ${tokens.spacing[100]}`,

    display: 'flex',
    gap: 2,

    ...typography.base['text-l'],

    transition: 'background-color 0.1s ease-out, transform 0.1s ease-out',
    position: 'absolute',
  },

  variants: {
    size: {
      medium: {
        selectors: {
          'button:focus-visible &, button[data-state="open"] &, button:not([data-placeholder]) &': {
            backgroundColor: tokens.select.bg,
            transform: 'translate(-4px, -22px)',
            ...typography.base['text-s'],
          },
        },
      },
      small: {
        selectors: {
          'button:focus-visible &, button[data-state="open"] &, button:not([data-placeholder]) &': {
            backgroundColor: tokens.select.bg,
            transform: 'translate(-4px, -18px)',
            ...typography.base['text-s'],
          },
        },
      },
    },
  },
});

export const requiredIndicatorStyle = style({
  marginTop: 4,
  width: 4,
  height: 4,
  backgroundColor: tokens.layerDesktop['fg-accent'],
  borderRadius: '50%',
});

export const chvronDownStyle = style({
  selectors: {
    '[data-state="open"] &': {
      transform: 'rotate(180deg)',
    },
  },
});

export const clearButtonStyle = style({
  display: 'flex',

  selectors: {
    'button[data-placeholder] &': {
      display: 'none !important',
    },
    'button[data-disabled] &': {
      display: 'none !important',
    },
  },
});
