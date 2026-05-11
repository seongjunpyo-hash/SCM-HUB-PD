import { colorTokenMap, typography } from '@musinsa/layer-tokens/desktop';
import { styleVariants } from '@vanilla-extract/css';

const { base, helperText } = typography;

const baseObject = Object.fromEntries(Object.entries(base).map(([key, value]) => [`base-${key}`, value])) as Record<
  `base-${keyof typeof base}`,
  (typeof base)[keyof typeof base]
>;

const helperTextObject = Object.fromEntries(
  Object.entries(helperText).map(([key, value]) => [`helper-text-${key}`, value]),
) as Record<`helper-text-${keyof typeof helperText}`, (typeof helperText)[keyof typeof helperText]>;

export const nameStyles = styleVariants({
  ...baseObject,
  ...helperTextObject,
});

export const colorTokenStyles = styleVariants(colorTokenMap, (color) => ({
  color,
}));
