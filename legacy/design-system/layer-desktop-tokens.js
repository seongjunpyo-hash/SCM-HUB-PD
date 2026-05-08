/**
 * MUSINSA LayerDesktop Design Tokens v2.17.0
 * --------------------------------------------------------------
 * JS / TS 양쪽에서 import 가능한 토큰 객체
 * Source: figma.com/design/nm6vlOA9stZAf03Q1LvsHa/LayerDesktop
 *
 * Usage:
 *   import { tokens, color, spacing, fontSize } from './layer-desktop-tokens'
 *   <Box sx={{ color: color.fg.accent, padding: spacing[400] }} />
 */

// ============================================================
// PRIMITIVE COLORS
// ============================================================

export const primitive = {
  gray: {
    0:   '#ffffff',
    100: '#f5f5f5',
    200: '#ebebeb',
    300: '#e0e0e0',
    400: '#cccccc',
    500: '#8a8a8a',
    600: '#666666',
    700: '#616161',
    800: '#1a1a1a',
    900: '#000000',
  },
  grayAlpha: {
    '900-20': 'rgba(0, 0, 0, 0.2)',
    '900-40': 'rgba(0, 0, 0, 0.4)',
    '900-60': 'rgba(0, 0, 0, 0.6)',
    '900-80': 'rgba(0, 0, 0, 0.8)',
    '500-5':  'rgba(138, 138, 138, 0.05)',
    '500-10': 'rgba(138, 138, 138, 0.1)',
    '500-15': 'rgba(138, 138, 138, 0.15)',
    '500-20': 'rgba(138, 138, 138, 0.2)',
    '500-30': 'rgba(138, 138, 138, 0.3)',
    '0-10':   'rgba(255, 255, 255, 0.1)',
    '0-15':   'rgba(255, 255, 255, 0.15)',
    '0-20':   'rgba(255, 255, 255, 0.2)',
  },
  blue: {
    100: '#b8d4ff',
    200: '#8eb8ff',
    300: '#649cff',
    500: '#245eff',
    bgLight: '#e2f1ff',
    'alpha-500-10': 'rgba(36, 94, 255, 0.1)',
    'alpha-500-20': 'rgba(36, 94, 255, 0.2)',
    'alpha-500-80': 'rgba(36, 94, 255, 0.8)',
    'alpha-500-90': 'rgba(36, 94, 255, 0.9)',
  },
  red: {
    400: '#ff5e56',
    500: '#f31110',
    600: '#d50f0e',
    bright: '#f94a4a',
    bgLight: '#ffecec',
    bgBright: '#fee4e4',
    borderLight: 'rgba(255, 171, 165, 0.3)',
    'alpha-500-10': 'rgba(243, 17, 16, 0.1)',
    'alpha-500-90': 'rgba(243, 17, 16, 0.9)',
  },
  yellow: {
    400: '#ffa12a',
    500: '#fa9200',
    600: '#db7f00',
    orange: '#fa6c00',
    bgLight: '#fff4e5',
    bgOrange: '#feefd9',
    borderLight: 'rgba(255, 203, 133, 0.5)',
    'alpha-500-10': 'rgba(250, 146, 0, 0.1)',
  },
  green: {
    400: '#27ba1d',
    500: '#1ea514',
    bgLight: '#ecffec',
    bgBright: '#ddf2dc',
    'alpha-500-10': 'rgba(30, 165, 20, 0.1)',
    'alpha-500-15': 'rgba(30, 165, 20, 0.15)',
  },
  cyan: {
    500: '#08979c',
    skyblue: '#00a8d1',
    bgLight: '#e6fffb',
    bgSky: '#e0f4fa',
  },
  purple: {
    500: '#722ed1',
    600: '#531dab',
    bright: '#981aff',
    bgLight: '#f9f0ff',
    bgBright: '#eee0fa',
  },
  tableHeaderBg: '#f8f9fc',
};

// ============================================================
// SEMANTIC COLORS
// ============================================================

export const color = {
  fg: {
    default:    primitive.gray[900],
    low:        primitive.gray[600],
    lower:      primitive.gray[500],
    lowest:     primitive.gray[400],
    disabled:   primitive.grayAlpha['900-20'],
    onContrast: primitive.gray[0],
    inverse:    primitive.gray[0],
    neutral:    primitive.gray[800],
    accent:     primitive.blue[500],
    success:    primitive.green[500],
    warning:    primitive.yellow[500],
    critical:   primitive.red[500],
  },
  bg: {
    default:        primitive.gray[0],
    low:            primitive.gray[100],
    inset:          primitive.gray[0],
    contrast:       primitive.gray[900],
    disabled:       primitive.grayAlpha['500-10'],
    transparent:    primitive.grayAlpha['900-60'],
    neutral:        primitive.gray[800],
    neutralLow:     primitive.gray[200],
    accent:         primitive.blue[500],
    accentLow:      primitive.blue['alpha-500-10'],
    accentBright:   primitive.blue.bgLight,
    success:        primitive.green[500],
    successLow:     primitive.green['alpha-500-10'],
    successBright:  primitive.green.bgLight,
    warning:        primitive.yellow[500],
    warningLow:     primitive.yellow['alpha-500-10'],
    warningBright:  primitive.yellow.bgLight,
    critical:       primitive.red[500],
    criticalLow:    primitive.red['alpha-500-10'],
    criticalBright: primitive.red.bgLight,
  },
  border: {
    default:    primitive.gray[300],
    low:        primitive.gray[200],
    strong:     primitive.gray[900],
    disabled:   primitive.gray[200],
    neutral:    primitive.gray[800],
    accent:     primitive.blue[500],
    success:    primitive.green[500],
    warning:    primitive.yellow[500],
    critical:   primitive.red[500],
  },
  divider: {
    default: primitive.gray[200],
    low:     primitive.grayAlpha['500-10'],
  },
  focus: {
    outline:   primitive.blue[500],
    outlineBg: primitive.blue['alpha-500-20'],
  },
};

// ============================================================
// TYPOGRAPHY
// ============================================================

export const fontFamily = {
  base: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
  mono: "'IBM Plex Mono', 'Roboto Mono', 'Noto Sans Mono', monospace",
};

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
};

export const fontSize = {
  75:   '12px',
  100:  '13px',
  125:  '14px',
  150:  '15px',
  200:  '16px',
  250:  '18px',
  300:  '20px',
  350:  '22px',
  450:  '26px',
  550:  '30px',
  1300: '60px',
};

export const lineHeight = {
  100: 1.0,
  120: 1.2,
  126: 1.26,
  136: 1.36,
  140: 1.4,
  150: 1.5,
};

export const text = {
  xs:           { fontSize: '12px', fontWeight: 400, lineHeight: 1.5  },
  xsMedium:     { fontSize: '12px', fontWeight: 500, lineHeight: 1.5  },
  s:            { fontSize: '13px', fontWeight: 400, lineHeight: 1.5  },
  sMedium:      { fontSize: '13px', fontWeight: 500, lineHeight: 1.5  },
  sSemibold:    { fontSize: '13px', fontWeight: 600, lineHeight: 1.5  },
  m:            { fontSize: '14px', fontWeight: 400, lineHeight: 1.4  },
  mMedium:      { fontSize: '14px', fontWeight: 500, lineHeight: 1.4  },
  mSemibold:    { fontSize: '14px', fontWeight: 600, lineHeight: 1.4  },
  l:            { fontSize: '15px', fontWeight: 400, lineHeight: 1.36 },
  lMedium:      { fontSize: '15px', fontWeight: 500, lineHeight: 1.36 },
  lSemibold:    { fontSize: '15px', fontWeight: 600, lineHeight: 1.36 },
  xl:           { fontSize: '16px', fontWeight: 400, lineHeight: 1.36 },
  xlMedium:     { fontSize: '16px', fontWeight: 500, lineHeight: 1.36 },
  xlSemibold:   { fontSize: '16px', fontWeight: 600, lineHeight: 1.36 },
  titleSSemibold:  { fontSize: '18px', fontWeight: 600, lineHeight: 1.36 },
  titleMSemibold:  { fontSize: '22px', fontWeight: 600, lineHeight: 1.36 },
  titleLSemibold:  { fontSize: '26px', fontWeight: 600, lineHeight: 1.4  },
  titleXlSemibold: { fontSize: '30px', fontWeight: 600, lineHeight: 1.4  },
  pageHeader:      { fontSize: '24px', fontWeight: 600, lineHeight: 1.5  },
};

// ============================================================
// SPACING / PADDING / RADIUS / ICON / BORDER
// ============================================================

export const spacing = {
  50:   '2px',
  100:  '4px',
  150:  '6px',
  200:  '8px',
  250:  '10px',
  300:  '12px',
  400:  '16px',
  500:  '20px',
  600:  '24px',
  800:  '32px',
  900:  '36px',
  1000: '40px',
  1500: '60px',
  1800: '72px',
  2000: '80px',
  2400: '96px',
};

export const padding = {
  xxs: '2px',
  xs:  '4px',
  s:   '6px',
  m:   '8px',
  l:   '10px',
  xl:  '12px',
  xxl: '16px',
  '3xl': '20px',
  '4xl': '24px',
  '5xl': '32px',
};

export const radius = {
  none: '0',
  xxs:  '2px',
  xs:   '4px',
  sm:   '6px',
  md:   '8px',
  lg:   '12px',
  xl:   '20px',
  full: '9999px',
};

export const iconSize = {
  xxs: '16px',
  xs:  '16px',
  s:   '16px',
  m:   '20px',
  l:   '24px',
  xl:  '28px',
};

export const borderWidth = {
  light: '1px',
  bold:  '2px',
};

export const shadow = {
  cursor:  '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  tooltip: '0 2px 8px 0 rgba(0, 0, 0, 0.16)',
  popover: '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
  modal:   '0 8px 32px 0 rgba(0, 0, 0, 0.16)',
};

export const zIndex = {
  base:    0,
  header:  100,
  drawer:  200,
  modal:   300,
  tooltip: 400,
  toast:   500,
};

// ============================================================
// COMPONENT TOKENS
// ============================================================

export const button = {
  primary: {
    bg:                primitive.gray[900],
    bgHover:           primitive.grayAlpha['900-80'],
    bgDisabled:        primitive.grayAlpha['500-10'],
    bgOutlined:        primitive.gray[0],
    bgOutlinedHover:   primitive.grayAlpha['500-10'],
    bgGhostHover:      primitive.grayAlpha['500-10'],
    border:            primitive.gray[900],
    borderDisabled:    primitive.gray[200],
    fg:                primitive.gray[900],
    fgContrast:        primitive.gray[0],
    fgDisabled:        primitive.grayAlpha['900-20'],
  },
  accent: {
    bg:                primitive.blue[500],
    bgHover:           primitive.blue['alpha-500-90'],
    bgOutlinedHover:   primitive.blue['alpha-500-10'],
    border:            primitive.blue[500],
    fg:                primitive.blue[500],
    fgContrast:        primitive.gray[0],
  },
  secondary: {
    bg:                primitive.gray[100],
    bgHover:           primitive.gray[200],
    bgDisabled:        primitive.grayAlpha['500-10'],
    bgOutlined:        primitive.gray[0],
    bgOutlinedHover:   primitive.grayAlpha['500-10'],
    bgGhostHover:      primitive.grayAlpha['500-10'],
    border:            primitive.gray[300],
    borderDisabled:    primitive.gray[200],
    fg:                primitive.gray[900],
    fgLow:             primitive.gray[600],
    fgDisabled:        primitive.grayAlpha['900-20'],
  },
  negative: {
    bg:                primitive.red[500],
    bgHover:           primitive.red['alpha-500-90'],
    bgOutlinedHover:   primitive.red['alpha-500-10'],
    border:            primitive.red[500],
    fg:                primitive.red[500],
    fgContrast:        primitive.gray[0],
  },
  size: {
    xs: { height: '32px', paddingX: '10px', paddingY: '6px',  fontSize: '13px', fontWeight: 400, gap: '2px', iconSize: '16px', minWidth: '40px' },
    sm: { height: '36px', paddingX: '12px', paddingY: '8px',  fontSize: '14px', fontWeight: 500, gap: '2px', iconSize: '16px', minWidth: '48px' },
    md: { height: '40px', paddingX: '12px', paddingY: '10px', fontSize: '14px', fontWeight: 500, gap: '4px', iconSize: '20px', minWidth: '56px' },
    lg: { height: '44px', paddingX: '16px', paddingY: '12px', fontSize: '15px', fontWeight: 500, gap: '4px', iconSize: '20px', minWidth: '56px' },
    xl: { height: '52px', paddingX: '20px', paddingY: '16px', fontSize: '15px', fontWeight: 500, gap: '4px', iconSize: '20px', minWidth: '64px' },
  },
  radius: radius.xs,
};

export const tag = {
  filter: {
    bg:               primitive.gray[0],
    bgHover:          primitive.grayAlpha['500-10'],
    bgDisabled:       primitive.grayAlpha['500-10'],
    border:           primitive.gray[300],
    borderSelected:   primitive.gray[900],
    borderDisabled:   primitive.gray[200],
  },
  variant: {
    gray:    { fg: '#7e7e7e',                 bg: '#f1f1f1' },
    blue:    { fg: primitive.blue[500],       bg: '#e9efff' },
    skyblue: { fg: primitive.cyan.skyblue,    bg: primitive.cyan.bgSky },
    purple:  { fg: primitive.purple.bright,   bg: primitive.purple.bgBright },
    green:   { fg: primitive.green[500],      bg: primitive.green.bgBright },
    red:     { fg: primitive.red.bright,      bg: primitive.red.bgBright },
    orange:  { fg: primitive.yellow.orange,   bg: primitive.yellow.bgOrange },
  },
};

export const statusTag = {
  default:   { fg: primitive.gray[600],     bg: primitive.gray[0]    },
  progress1: { fg: primitive.blue[500],     bg: primitive.blue.bgLight },
  progress2: { fg: primitive.cyan[500],     bg: primitive.cyan.bgLight },
  progress3: { fg: primitive.purple[500],   bg: primitive.purple.bgLight },
  success:   { fg: primitive.green[500],    bg: primitive.green.bgLight },
  warning:   { fg: primitive.yellow[600],   bg: primitive.yellow.bgLight },
  critical:  { fg: primitive.red[600],      bg: primitive.red.bgLight },
  size: {
    xs: { height: '20px', fontSize: '12px', fontWeight: 500, lineHeight: 1.5 },
    s:  { height: '24px', fontSize: '13px', fontWeight: 500, lineHeight: 1.5 },
    m:  { height: '28px', fontSize: '14px', fontWeight: 500, lineHeight: 1.4 },
  },
};

export const labelTag = {
  fg:       primitive.gray[900],
  bgTinted: 'rgba(0, 0, 0, 0.05)',
  bgGray:   primitive.gray[0],
  bgBlue:   primitive.blue.bgLight,
  bgGreen:  primitive.green.bgLight,
  bgRed:    primitive.red.bgLight,
  bgYellow: primitive.yellow.bgLight,
};

export const banner = {
  info:     { bg: 'rgba(224, 224, 224, 0.2)',     border: primitive.gray[200],          iconFg: primitive.gray[500]  },
  warning:  { bg: primitive.yellow.bgLight,       border: primitive.yellow.borderLight, iconFg: primitive.yellow[500]},
  critical: { bg: primitive.red.bgLight,          border: primitive.red.borderLight,    iconFg: primitive.red[600]   },
};

export const tooltip = {
  black: { bg: primitive.gray[800], fg: primitive.gray[0]   },
  white: { bg: primitive.gray[0],   fg: primitive.gray[900] },
};

export const textField = {
  bg:             primitive.gray[0],
  bgDisabled:     primitive.grayAlpha['500-10'],
  border:         primitive.gray[300],
  borderHover:    primitive.gray[900],
  borderActive:   primitive.gray[900],
  borderDisabled: primitive.gray[200],
  borderCritical: primitive.red[500],
  radius:         radius.xs,
};

export const select = {
  bg:             primitive.gray[0],
  bgDisabled:     primitive.grayAlpha['500-10'],
  bgCount:        primitive.gray[200],
  border:         primitive.gray[300],
  borderHover:    primitive.gray[900],
  borderActive:   primitive.gray[900],
  borderDisabled: primitive.gray[200],
  radius:         radius.xs,
};

export const control = {
  bg:                       primitive.gray[0],
  bgChecked:                primitive.gray[900],
  bgCheckedHover:           '#2a2a2a',
  bgCheckedDisabled:        primitive.gray[400],
  bgDisabled:               primitive.gray[100],
  bgHover:                  primitive.grayAlpha['500-10'],
  border:                   primitive.gray[300],
  borderDisabled:           primitive.gray[200],
  indicatorBgChecked:       primitive.gray[0],
  indicatorBgCheckedDisabled: primitive.gray[200],
};

export const switchToken = {
  track:                primitive.gray[400],
  trackHover:           primitive.gray[300],
  trackChecked:         primitive.gray[900],
  trackCheckedHover:    '#2a2a2a',
  trackDisabled:        primitive.gray[200],
  trackCheckedDisabled: primitive.gray[400],
  thumb:                primitive.gray[0],
  thumbDisabled:        primitive.gray[100],
};

export const nav = {
  width:           '260px',
  collapsedWidth:  '60px',
  bg:              primitive.gray[0],
  bgDark:          primitive.gray[900],
  fg:              primitive.gray[900],
  fgLow:           primitive.gray[600],
  fgLower:         primitive.gray[500],
  divider:         primitive.gray[200],
  itemBgHover:     primitive.gray[100],
  itemBgActive:    primitive.blue.bgLight,
  itemCountFg:     primitive.blue[500],
  envBg:           primitive.purple[500],
  envBgHover:      primitive.purple[600],
};

export const pageHeader = {
  fg:              primitive.gray[900],
  fgLow:           primitive.gray[600],
  bg:              primitive.gray[0],
  separator:       primitive.gray[200],
  divider:         primitive.grayAlpha['500-10'],
  collapsedHeight: '56px',
};

export const workspaceTabs = {
  minWidth:    '80px',
  maxWidth:    '200px',
  bg:          primitive.gray[100],
  border:      primitive.gray[300],
  fg:          primitive.gray[900],
  fgLower:     primitive.gray[500],
  tabBgActive: primitive.gray[0],
  tabBgHover:  primitive.gray[200],
  tabFgActive: primitive.gray[900],
};

export const drawer = {
  overlayBg: primitive.grayAlpha['900-20'],
};

// ============================================================
// MASTER EXPORT
// ============================================================

export const tokens = {
  primitive,
  color,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  text,
  spacing,
  padding,
  radius,
  iconSize,
  borderWidth,
  shadow,
  zIndex,
  button,
  tag,
  statusTag,
  labelTag,
  banner,
  tooltip,
  textField,
  select,
  control,
  switch: switchToken,
  nav,
  pageHeader,
  workspaceTabs,
  drawer,
};

export default tokens;
