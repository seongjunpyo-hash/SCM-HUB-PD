import { colors, tokens, typography } from './output/desktop/token';
import { createFlattenDesktopColorTokenMap } from './types/color-token-map';

type Tokens = typeof tokens;
type Colors = typeof colors;
type Typography = typeof typography;

const colorTokenMap = createFlattenDesktopColorTokenMap(colors);
type ColorToken = keyof typeof colorTokenMap;

/** Desktop 플랫폼용 tokens */
export { colors, colorTokenMap, tokens, typography };
export type { Colors, ColorToken, Tokens, Typography };
