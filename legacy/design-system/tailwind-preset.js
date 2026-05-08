/**
 * MUSINSA LayerDesktop Tailwind Preset v2.17.0
 * --------------------------------------------------------------
 * Tailwind 프로젝트에서 사용하려면 tailwind.config.js에서:
 *
 *   import layerDesktopPreset from './design-system/tailwind-preset.js'
 *   export default {
 *     presets: [layerDesktopPreset],
 *     content: ['./src/**\/*.{js,jsx,ts,tsx}'],
 *   }
 *
 * 클래스 prefix는 `ld-` 권장 (옵션):
 *   prefix: 'ld-'
 */

import { primitive, color, fontFamily, fontWeight, fontSize, spacing, padding, radius, iconSize, borderWidth, shadow, zIndex } from './layer-desktop-tokens.js';

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    // 색상 (semantic + primitive)
    colors: {
      transparent: 'transparent',
      current:     'currentColor',
      // primitive
      gray:   primitive.gray,
      blue:   { 100: primitive.blue[100], 200: primitive.blue[200], 300: primitive.blue[300], 500: primitive.blue[500], 'bg-light': primitive.blue.bgLight },
      red:    { 400: primitive.red[400], 500: primitive.red[500], 600: primitive.red[600], 'bg-light': primitive.red.bgLight, bright: primitive.red.bright },
      yellow: { 400: primitive.yellow[400], 500: primitive.yellow[500], 600: primitive.yellow[600], 'bg-light': primitive.yellow.bgLight, orange: primitive.yellow.orange },
      green:  { 400: primitive.green[400], 500: primitive.green[500], 'bg-light': primitive.green.bgLight },
      cyan:   { 500: primitive.cyan[500], skyblue: primitive.cyan.skyblue, 'bg-light': primitive.cyan.bgLight },
      purple: { 500: primitive.purple[500], 600: primitive.purple[600], bright: primitive.purple.bright, 'bg-light': primitive.purple.bgLight },
      // semantic — usage: text-fg, bg-bg-low, border-border, ...
      fg: {
        DEFAULT:      color.fg.default,
        low:          color.fg.low,
        lower:        color.fg.lower,
        lowest:       color.fg.lowest,
        disabled:     color.fg.disabled,
        'on-contrast':color.fg.onContrast,
        inverse:      color.fg.inverse,
        neutral:      color.fg.neutral,
        accent:       color.fg.accent,
        success:      color.fg.success,
        warning:      color.fg.warning,
        critical:     color.fg.critical,
      },
      bg: {
        DEFAULT:        color.bg.default,
        low:            color.bg.low,
        contrast:       color.bg.contrast,
        disabled:       color.bg.disabled,
        transparent:    color.bg.transparent,
        neutral:        color.bg.neutral,
        'neutral-low':  color.bg.neutralLow,
        accent:         color.bg.accent,
        'accent-low':   color.bg.accentLow,
        'accent-bright':color.bg.accentBright,
        success:        color.bg.success,
        'success-low':  color.bg.successLow,
        'success-bright':color.bg.successBright,
        warning:        color.bg.warning,
        'warning-low':  color.bg.warningLow,
        'warning-bright':color.bg.warningBright,
        critical:       color.bg.critical,
        'critical-low': color.bg.criticalLow,
        'critical-bright':color.bg.criticalBright,
      },
      border: {
        DEFAULT:    color.border.default,
        low:        color.border.low,
        strong:     color.border.strong,
        disabled:   color.border.disabled,
        neutral:    color.border.neutral,
        accent:     color.border.accent,
        success:    color.border.success,
        warning:    color.border.warning,
        critical:   color.border.critical,
      },
    },

    // 폰트
    fontFamily: {
      sans: fontFamily.base.split(',').map(s => s.trim().replace(/['"]/g, '')),
      mono: fontFamily.mono.split(',').map(s => s.trim().replace(/['"]/g, '')),
    },
    fontWeight: {
      regular:  String(fontWeight.regular),
      normal:   String(fontWeight.regular),
      medium:   String(fontWeight.medium),
      semibold: String(fontWeight.semibold),
      bold:     String(fontWeight.bold),
    },
    fontSize: {
      // numeric (LayerDesktop spec)
      75:   [fontSize[75],   { lineHeight: '1.5' }],
      100:  [fontSize[100],  { lineHeight: '1.5' }],
      125:  [fontSize[125],  { lineHeight: '1.4' }],
      150:  [fontSize[150],  { lineHeight: '1.36' }],
      200:  [fontSize[200],  { lineHeight: '1.36' }],
      250:  [fontSize[250],  { lineHeight: '1.36' }],
      300:  [fontSize[300],  { lineHeight: '1.4' }],
      350:  [fontSize[350],  { lineHeight: '1.36' }],
      450:  [fontSize[450],  { lineHeight: '1.4' }],
      550:  [fontSize[550],  { lineHeight: '1.4' }],
      1300: [fontSize[1300], { lineHeight: '1.0' }],
      // alias (Tailwind-friendly)
      xs:   [fontSize[75],   { lineHeight: '1.5' }],
      sm:   [fontSize[100],  { lineHeight: '1.5' }],
      base: [fontSize[125],  { lineHeight: '1.4' }],
      md:   [fontSize[150],  { lineHeight: '1.36' }],
      lg:   [fontSize[200],  { lineHeight: '1.36' }],
      xl:   [fontSize[250],  { lineHeight: '1.36' }],
      '2xl':[fontSize[350],  { lineHeight: '1.36' }],
      '3xl':[fontSize[450],  { lineHeight: '1.4' }],
      '4xl':[fontSize[550],  { lineHeight: '1.4' }],
      '5xl':[fontSize[1300], { lineHeight: '1.0' }],
    },
    lineHeight: {
      none: '1',
      tight: '1.2',
      snug:  '1.26',
      base:  '1.36',
      normal:'1.4',
      relaxed:'1.5',
    },

    // Spacing — LayerDesktop numeric scale + Tailwind alias
    spacing: {
      0: '0',
      px: '1px',
      // numeric
      50: spacing[50],     // 2
      100: spacing[100],   // 4
      150: spacing[150],   // 6
      200: spacing[200],   // 8
      250: spacing[250],   // 10
      300: spacing[300],   // 12
      400: spacing[400],   // 16
      500: spacing[500],   // 20
      600: spacing[600],   // 24
      800: spacing[800],   // 32
      900: spacing[900],   // 36
      1000: spacing[1000], // 40
      1500: spacing[1500], // 60
      1800: spacing[1800], // 72
      2000: spacing[2000], // 80
      2400: spacing[2400], // 96
      // alias
      xxs: padding.xxs,
      xs:  padding.xs,
      s:   padding.s,
      m:   padding.m,
      l:   padding.l,
      xl:  padding.xl,
      xxl: padding.xxl,
      '3xl': padding['3xl'],
      '4xl': padding['4xl'],
      '5xl': padding['5xl'],
    },

    // 모서리
    borderRadius: {
      none: '0',
      xxs:  radius.xxs,
      xs:   radius.xs,
      sm:   radius.sm,
      md:   radius.md,
      lg:   radius.lg,
      xl:   radius.xl,
      full: radius.full,
      DEFAULT: radius.xs,
    },

    // 테두리 두께
    borderWidth: {
      0: '0',
      DEFAULT: borderWidth.light,
      light:   borderWidth.light,
      bold:    borderWidth.bold,
    },

    // 그림자
    boxShadow: {
      none:    'none',
      cursor:  shadow.cursor,
      tooltip: shadow.tooltip,
      popover: shadow.popover,
      modal:   shadow.modal,
    },

    // z-index
    zIndex: {
      auto: 'auto',
      base:    String(zIndex.base),
      header:  String(zIndex.header),
      drawer:  String(zIndex.drawer),
      modal:   String(zIndex.modal),
      tooltip: String(zIndex.tooltip),
      toast:   String(zIndex.toast),
    },

    extend: {
      width: {
        'icon-xxs': iconSize.xxs,
        'icon-xs':  iconSize.xs,
        'icon-s':   iconSize.s,
        'icon-m':   iconSize.m,
        'icon-l':   iconSize.l,
        'icon-xl':  iconSize.xl,
        'nav':           '260px',
        'nav-collapsed':  '60px',
      },
      height: {
        'icon-xxs': iconSize.xxs,
        'icon-xs':  iconSize.xs,
        'icon-s':   iconSize.s,
        'icon-m':   iconSize.m,
        'icon-l':   iconSize.l,
        'icon-xl':  iconSize.xl,
        // button heights
        'btn-xs': '32px',
        'btn-sm': '36px',
        'btn-md': '40px',
        'btn-lg': '44px',
        'btn-xl': '52px',
      },
      outlineColor: {
        focus: color.focus.outline,
      },
    },
  },
};
