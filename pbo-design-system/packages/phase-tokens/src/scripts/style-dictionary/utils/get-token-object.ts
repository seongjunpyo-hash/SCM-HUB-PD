import type { TransformedToken } from 'style-dictionary/types';

type TokenObject = {
  [key: string]: TokenObject | string | number;
};

/**
 *  토큰들을 token 객체로 변환
 *  - path: ['a','b','c'] => a.b.c = value 형태
 */
export const getTokenObject = (tokens: TransformedToken[]): TokenObject => {
  const result: TokenObject = {};

  tokens.forEach((token) => {
    const path = token.path;

    let current = result;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]!;
      current[key] ??= {};
      current = current[key] as TokenObject;
    }

    const lastKey = path[path.length - 1];

    if (lastKey) {
      current[lastKey] = token.value;
    }
  });

  return result;
};
