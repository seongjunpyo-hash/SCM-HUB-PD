import { tokens, typography } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const textButtonStyle = style({
  width: 'fit-content',
  border: 'none',
  background: 'none',
  borderRadius: tokens.rounded.xxs,
  padding: 2,
  cursor: 'pointer',

  display: 'flex',
  gap: tokens.spacing[100],
  alignItems: 'center',

  ':disabled': {
    cursor: 'not-allowed',
  },
  // focus는 공통
  ':focus-visible': {
    outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
    outlineOffset: 1,
  },
});

export const defaultToneVariantStyles = styleVariants({
  primary: {
    color: tokens.textButton.primary.fg,
    ':hover': {
      color: tokens.textButton.primary['fg-hover'],
      backgroundColor: tokens.button.primary['bgGhost-hover'],
    },
    ':active': {
      color: tokens.textButton.primary['fg-pressed'],
      backgroundColor: tokens.button.primary['bgGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.textButton.primary['fg-disabled'],
    },
  },
  secondary: {
    color: tokens.textButton.secondary.fg,
    ':hover': {
      color: tokens.textButton.secondary['fg-hover'],
      backgroundColor: tokens.button.secondary['bgGhost-hover'],
    },
    ':active': {
      color: tokens.textButton.secondary['fg-pressed'],
      backgroundColor: tokens.button.secondary['bgGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.textButton.secondary['fg-disabled'],
    },
  },
  negative: {
    color: tokens.textButton.negative.fg,
    ':hover': {
      color: tokens.textButton.negative['fg-hover'],
      backgroundColor: tokens.button.negative['bgGhost-hover'],
    },
    ':active': {
      color: tokens.textButton.negative['fg-pressed'],
      backgroundColor: tokens.button.negative['bgGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.textButton.negative['fg-disabled'],
    },
  },
  accent: {
    color: tokens.layerDesktop['fg-accent'],
    ':hover': {
      color: tokens.textButton.accent['fg-hover'],
      backgroundColor: tokens.button.primary['bgAccentGhost-hover'],
    },
    ':active': {
      color: tokens.textButton.accent['fg-pressed'],
      backgroundColor: tokens.button.primary['bgAccentGhost-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.textButton.accent['fg-disabled'],
    },
  },
});

// accent에서만 유효함
export const onContrastToneVariantStyles = styleVariants({
  accent: {
    color: tokens.textButton.accent['fg-onContrast'],
    ':hover': {
      color: tokens.textButton.accent['fg-onContrast'],
      backgroundColor: tokens.textButton.accent['bg-onContrast-hover'],
    },
    ':active': {
      color: tokens.textButton.accent['fg-onContrast'],
      backgroundColor: tokens.textButton.accent['bg-onContrast-pressed'],
    },
    ':disabled': {
      backgroundColor: 'transparent',
      color: tokens.textButton.accent['fg-onContrast-disabled'],
    },
  },
});

export const sizeStyles = styleVariants({
  xlarge: {
    ...typography.base['text-xl-medium'],
  },
  large: {
    ...typography.base['text-l-medium'],
  },
  medium: {
    ...typography.base['text-m-medium'],
  },
  small: {
    ...typography.base['text-s'],
  },
});

export const isUnderlineStyle = style({
  textDecoration: 'underline',
});
