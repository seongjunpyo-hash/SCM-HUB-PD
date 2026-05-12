import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

export const buttonStyle = style({
  width: 'fit-content',
  border: 'none',
  background: 'none',
  cursor: 'pointer',

  display: 'flex',
  gap: tokens.spacing[100],
  alignItems: 'center',

  ':disabled': {
    cursor: 'not-allowed',
  },
});

/** tone -> default variant */
export const defaultToneVariantStyles = styleVariants({
  primary: {
    color: tokens.textButton.primary.fg,
    ':active': {
      color: tokens.textButton.primary['fg-pressed'],
    },
    ':disabled': {
      color: tokens.textButton.primary['fg-disabled'],
    },
  },
  secondary: {
    color: tokens.textButton.secondary.fg,
    ':active': {
      color: tokens.textButton.secondary['fg-pressed'],
    },
    ':disabled': {
      color: tokens.textButton.secondary['fg-disabled'],
    },
  },
  accent: {
    color: tokens.primitive.color.blue['500'],
    ':active': {
      color: tokens.textButton.accent['fg-pressed'],
    },
    ':disabled': {
      color: tokens.textButton.accent['fg-disabled'],
    },
  },
});

/** tone -> onContrast variant (primary, accent에서만 유효함) */
export const onContrastToneVariantStyles = styleVariants({
  primary: {
    color: tokens.textButton.primary['fg-onContrast'],
    ':active': {
      color: tokens.textButton.primary['fg-onContrast-pressed'],
    },
    ':disabled': {
      color: tokens.textButton.primary['fg-onContrast-disabled'],
    },
  },
  accent: {
    color: tokens.textButton.accent['fg-onContrast'],
    ':active': {
      color: tokens.textButton.accent['fg-onContrast-pressed'],
    },
    ':disabled': {
      color: tokens.textButton.accent['fg-onContrast-disabled'],
    },
  },
});

export const sizeStyles = styleVariants({
  medium: {
    ...typography.base['text-s-semibold'],
  },
  small: {
    ...typography.base['text-xs-semibold'],
  },
});
