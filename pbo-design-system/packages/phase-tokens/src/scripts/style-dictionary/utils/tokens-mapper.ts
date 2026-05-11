import { parseTypographyValue } from './parse-typography-value';

import type { TransformedToken } from 'style-dictionary/types';

type TokenType =
  | 'fontSizes'
  | 'borderWidth'
  | 'letterSpacing'
  | 'fontWeights'
  | 'fontFamilies'
  | 'textDecoration'
  | 'lineHeights'
  | 'borderRadius'
  | 'dimension'
  | 'sizing'
  | 'spacing'
  | 'typography'
  | 'color';

/**
 *  token value parse (color 토큰은 별도)
 *  - type 마다 분기처리하여 parsing 필요
 */
export const tokensMapper = (token: TransformedToken): TransformedToken => {
  const { type, value } = token as TransformedToken & { type: TokenType };

  if (type === 'color') {
    return parseColorToken(token);
  }
  if (type === 'fontSizes') {
    return { ...token, value: `${value}px` };
  }
  if (type === 'borderWidth') {
    return { ...token, value: `${value}px` };
  }
  if (type === 'letterSpacing') {
    return { ...token, value: `${value}px` };
  }
  if (type === 'fontWeights') {
    return { ...token, value: Number(value) };
  }
  if (type === 'fontFamilies') {
    return { ...token };
  }
  if (type === 'textDecoration') {
    return { ...token };
  }
  if (type === 'lineHeights') {
    const hasPercent = value.includes('%');
    return { ...token, value: hasPercent ? value : `${value}px` };
  }
  if (type === 'borderRadius') {
    return { ...token, value: `${value}px` };
  }
  if (type === 'dimension') {
    return { ...token, value: parseMultiplicationValue(token) };
  }
  if (type === 'sizing') {
    return { ...token, value: parseMultiplicationValue(token) };
  }
  if (type === 'spacing') {
    return { ...token, value: parseMultiplicationValue(token) };
  }
  if (type === 'typography') {
    return { ...token, value: parseTypographyValue(token) };
  }

  return token;
};

// 4px*2 -> 2px
const parseMultiplicationValue = (token: TransformedToken) => {
  const { value } = token;
  const [base, unit] = value.split('*');

  if (!base || !unit) {
    return value;
  }

  const firstNumber = parseFloat(base);
  const secondNumber = parseFloat(unit);

  return `${firstNumber * secondNumber}px`;
};

/**
 *  primitive 토큰을 제외하고 vars(--*) 형태로 변환
 */
const parseColorToken = (token: TransformedToken) => {
  const { name, path } = token;

  const isPrimitive = name.startsWith('primitive');

  if (isPrimitive) {
    return token;
  }

  const value = `var(--${path.join('-')})`;

  return {
    ...token,
    value,
  };
};
