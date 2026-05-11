import { colorTokenMap, typography } from '@musinsa/layer-tokens/pda';
import { styleVariants } from '@vanilla-extract/css';

const { base, mono } = typography;

const baseObject = Object.fromEntries(Object.entries(base).map(([key, value]) => [`base-${key}`, value])) as Record<
  `base-${keyof typeof base}`,
  (typeof base)[keyof typeof base]
>;

// 토큰에는 포함되어있지 않지만, mono 타입은 무조건 slashed-zero가 포함되어야함
const monoObject = Object.fromEntries(
  Object.entries(mono).map(([key, value]) => [
    `mono-${key}`,
    {
      ...value,
      fontVariantNumeric: 'slashed-zero',
    },
  ]),
) as Record<`mono-${keyof typeof mono}`, (typeof mono)[keyof typeof mono] & { fontVariantNumeric: 'slashed-zero' }>;

export const nameStyles = styleVariants({
  ...baseObject,
  ...monoObject,
});

export const colorTokenStyles = styleVariants(colorTokenMap, (color) => ({
  color,
}));
