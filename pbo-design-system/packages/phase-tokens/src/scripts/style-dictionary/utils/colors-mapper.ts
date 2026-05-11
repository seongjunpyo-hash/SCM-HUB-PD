import type { TransformedToken } from 'style-dictionary/types';

export const colorsMapper = (token: TransformedToken): TransformedToken | undefined => {
  const { name, path } = token;

  const isPrimitive = name.startsWith('primitive');

  if (isPrimitive) {
    return {
      ...token,
      path: path.filter((p) => p !== 'primitive' && p !== 'color'),
    };
  }

  // functional, components
  const value = `var(--${path.join('-')})`;

  return {
    ...token,
    value,
  };
};
