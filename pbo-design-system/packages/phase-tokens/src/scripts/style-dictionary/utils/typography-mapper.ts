import { parseTypographyValue } from './parse-typography-value';

import type { TransformedToken } from 'style-dictionary/types';

// typography는 functional 토큰만 존재함
export const typographyMapper = (token: TransformedToken): TransformedToken | undefined => {
  const { path, filePath } = token;

  const isComponentTypography = filePath.includes('Component');

  if (isComponentTypography) {
    return undefined;
  }

  return {
    ...token,
    path: path.slice(1),
    value: parseTypographyValue(token),
  };
};
