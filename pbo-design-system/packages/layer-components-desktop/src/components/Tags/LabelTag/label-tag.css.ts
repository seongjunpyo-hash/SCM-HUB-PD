import { tokens } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const labelTagStyle = style({
  color: tokens.labelTag.fg,
  borderRadius: tokens.rounded.xs,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[100],
});

export const colorVariantStyles = styleVariants({
  gray: {
    backgroundColor: tokens.labelTag['bg-gray'],
    backgroundImage: `linear-gradient(0deg, ${tokens.labelTag['bg-tinted']}, ${tokens.labelTag['bg-tinted']})`,
  },
  blue: {
    backgroundColor: tokens.labelTag['bg-blue'],
  },
  green: {
    backgroundColor: tokens.labelTag['bg-green'],
    backgroundImage: `linear-gradient(0deg, ${tokens.labelTag['bg-tinted']}, ${tokens.labelTag['bg-tinted']})`,
  },
  yellow: {
    backgroundColor: tokens.labelTag['bg-yellow'],
  },
  red: {
    backgroundColor: tokens.labelTag['bg-red'],
  },
});

export const sizeStyles = recipe({
  base: {},
  variants: {
    size: {
      xsmall: {
        height: tokens.labelTag.height.xs,
        ...tokens.labelTag['label-xs'],
      },
      small: {
        height: tokens.labelTag.height.s,
        ...tokens.labelTag['label-s'],
      },
      medium: {
        height: tokens.labelTag.height.m,
        ...tokens.labelTag['label-m'],
      },
    },
    infoIcon: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { size: 'xsmall', infoIcon: false },
      style: {
        padding: `0 ${tokens.spacing[150]}`,
      },
    },
    {
      variants: { size: 'xsmall', infoIcon: true },
      style: {
        padding: `0 ${tokens.spacing[200]}`,
      },
    },
    {
      variants: { size: 'small', infoIcon: false },
      style: {
        padding: `${tokens.spacing[50]} ${tokens.spacing[150]}`,
      },
    },
    {
      variants: { size: 'small', infoIcon: true },
      style: {
        padding: `0 ${tokens.spacing[200]}`,
      },
    },
    {
      variants: { size: 'medium', infoIcon: false },
      style: {
        padding: `0 ${tokens.spacing[200]}`,
      },
    },
    {
      variants: { size: 'medium', infoIcon: true },
      style: {
        padding: `0 ${tokens.spacing[200]}`,
      },
    },
  ],
});

export const countStyles = styleVariants({
  xsmall: {
    ...tokens.labelTag['count-xs'],
  },
  small: {
    ...tokens.labelTag['count-s'],
  },
  medium: {
    ...tokens.labelTag['count-m'],
  },
});
