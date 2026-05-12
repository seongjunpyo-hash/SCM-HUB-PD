/* eslint-disable @typescript-eslint/no-explicit-any */
import type { colors as desktopColors } from '../desktop';
import type { colors as mobileColors } from '../mobile';

type FlattenColorObjectKeys<T extends Record<string, any>, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? FlattenColorObjectKeys<T[K], `${Prefix}${Prefix extends '' ? '' : '-'}${K & string}`>
    : `${Prefix}${Prefix extends '' ? '' : '-'}${K & string}`;
}[keyof T];

/**
 *  객체의 nesting 구조를 flatten 및 스네이크 케이스로 변환
 *  - base.gray.900 -> base-gray-900
 */
export const createFlattenDesktopColorTokenMap = (
  colorObj: Record<string, any>,
  prefix = '',
): Record<FlattenColorObjectKeys<typeof desktopColors>, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(colorObj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, createFlattenDesktopColorTokenMap(value, newKey));
    }
  }

  return result;
};

export const createFlattenMobileColorTokenMap = (
  colorObj: Record<string, any>,
  prefix = '',
): Record<FlattenColorObjectKeys<typeof mobileColors>, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(colorObj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, createFlattenMobileColorTokenMap(value, newKey));
    }
  }

  return result;
};
