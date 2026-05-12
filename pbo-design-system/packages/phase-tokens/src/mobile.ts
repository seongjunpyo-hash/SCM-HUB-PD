import { colors, tokens, typography } from './output/mobile/token';
import { createFlattenMobileColorTokenMap } from './types/color-token-map';

type Tokens = typeof tokens;
type Colors = typeof colors;
type Typography = typeof typography;

const colorTokenMap = createFlattenMobileColorTokenMap(colors);
type ColorToken = keyof typeof colorTokenMap;

/** PDA 플랫폼용 tokens */
export { colors, colorTokenMap, tokens, typography };
export type { Colors, ColorToken, Tokens, Typography };
