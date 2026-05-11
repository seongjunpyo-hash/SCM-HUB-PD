import { colorTokenMap as desktopColorTokenMap } from '@musinsa/layer-tokens/desktop';
import { colorTokenMap as pdaColorTokenMap } from '@musinsa/layer-tokens/pda';
import { colorTokenMap as posColorTokenMap } from '@musinsa/layer-tokens/pos';

/**
 *  Basic은 web, pda, pos 모두 공통으로 사용되므로 모든 토큰을 prop으로 받을 수 있어야함
 *  다만, 다른 플랫폼 토큰을 사용할 경우 sheet가 없어서 기본색상으로 나올 것
 */
export const colorTokenMap = {
  ...desktopColorTokenMap,
  ...pdaColorTokenMap,
  ...posColorTokenMap,
};

export type ColorToken = keyof typeof colorTokenMap;
