import { colors, tokens, typography } from './output/pos/token';
import { createFlattenPosColorTokenMap } from './types/color-token-map';

type Tokens = typeof tokens;
type Colors = typeof colors;
type Typography = typeof typography;

const colorTokenMap = createFlattenPosColorTokenMap(colors);
type ColorToken = keyof typeof colorTokenMap;

/** POS 플랫폼용 tokens */
export { colors, colorTokenMap, tokens, typography };
export type { Colors, ColorToken, Tokens, Typography };
