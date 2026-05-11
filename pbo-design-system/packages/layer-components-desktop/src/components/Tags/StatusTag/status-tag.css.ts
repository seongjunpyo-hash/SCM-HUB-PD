import { tokens } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

export const statusTagStyle = style({
  borderRadius: tokens.rounded.xs,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: tokens.spacing[100],
});

export const restVariantStyles = styleVariants({
  default: {
    backgroundColor: tokens.statusTag.default.bg,
    color: tokens.statusTag.default.fg,
    backgroundImage: `linear-gradient(0deg, ${tokens.statusTag['bg-tinted']}, ${tokens.statusTag['bg-tinted']})`,
  },
  success: {
    backgroundColor: tokens.statusTag.success.bg,
    color: tokens.statusTag.success.fg,
    backgroundImage: `linear-gradient(0deg, ${tokens.statusTag['bg-tinted']}, ${tokens.statusTag['bg-tinted']})`,
  },
  warning: {
    backgroundColor: tokens.statusTag.warning.bg,
    color: tokens.statusTag.warning.fg,
  },
  critical: {
    backgroundColor: tokens.statusTag.critical.bg,
    color: tokens.statusTag.critical.fg,
  },
});

export const progressStyles = styleVariants({
  primary: {
    backgroundColor: tokens.statusTag.progress['bg-primary'],
    color: tokens.statusTag.progress['fg-primary'],
  },
  secondary: {
    backgroundColor: tokens.statusTag.progress['bg-secondary'],
    color: tokens.statusTag.progress['fg-secondary'],
    backgroundImage: `linear-gradient(0deg, ${tokens.statusTag['bg-tinted']}, ${tokens.statusTag['bg-tinted']})`,
  },
  tertiary: {
    backgroundColor: tokens.statusTag.progress['bg-tertiary'],
    color: tokens.statusTag.progress['fg-tertiary'],
    backgroundImage: `linear-gradient(0deg, ${tokens.statusTag['bg-tinted']}, ${tokens.statusTag['bg-tinted']})`,
  },
});

export const solidStyles = styleVariants({
  xsmall: {
    height: 20,
    padding: `0 ${tokens.spacing[150]}`,
    ...tokens.statusTag['label-xs'],
  },
  small: {
    height: 24,
    padding: `${tokens.spacing[50]} ${tokens.spacing[150]}`,
    ...tokens.statusTag['label-s'],
  },
  medium: {
    height: 28,
    padding: `${tokens.spacing[100]} ${tokens.spacing[200]}`,
    ...tokens.statusTag['label-m'],
  },
});

export const subtleStyles = styleVariants({
  xsmall: {
    color: tokens.statusTag['fg-subtle'],
    ...tokens.statusTag['label-xs-subtle'],
  },
  small: {
    color: tokens.statusTag['fg-subtle'],
    ...tokens.statusTag['label-s-subtle'],
  },
  medium: {
    color: tokens.statusTag['fg-subtle'],
    ...tokens.statusTag['label-m-subtle'],
  },
});

export const badgeSizeStyles = styleVariants({
  xsmall: {
    borderRadius: tokens.rounded.full,
    width: 6,
    height: 6,
  },
  small: {
    borderRadius: tokens.rounded.full,
    width: 6,
    height: 6,
  },
  medium: {
    borderRadius: tokens.rounded.full,
    width: 8,
    height: 8,
  },
});

export const badgeStyles = styleVariants({
  default: {
    backgroundColor: tokens.statusTag.default.fg,
  },
  success: {
    backgroundColor: tokens.statusTag.success.fg,
  },
  warning: {
    backgroundColor: tokens.statusTag.warning.fg,
  },
  critical: {
    backgroundColor: tokens.statusTag.critical.fg,
  },
});

export const badgeProgressStyles = styleVariants({
  primary: {
    backgroundColor: tokens.statusTag.progress['fg-primary'],
  },
  secondary: {
    backgroundColor: tokens.statusTag.progress['fg-secondary'],
  },
  tertiary: {
    backgroundColor: tokens.statusTag.progress['fg-tertiary'],
  },
});

export const countStyles = styleVariants({
  xsmall: {
    color: tokens.statusTag['fg-count'],
    ...tokens.statusTag['count-xs'],
  },
  small: {
    color: tokens.statusTag['fg-count'],
    ...tokens.statusTag['count-s'],
  },
  medium: {
    color: tokens.statusTag['fg-count'],
    ...tokens.statusTag['count-m'],
  },
});
