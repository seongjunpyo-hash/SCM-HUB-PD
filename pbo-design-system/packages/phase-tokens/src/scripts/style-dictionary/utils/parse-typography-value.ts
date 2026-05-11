import PrimitiveJSON from '../../../../../_shared/tokens/Core/Primitive/Restricted.json';

import type { TransformedToken } from 'style-dictionary/types';

// 400 26/150% Pretendard 형식 (typographyCssShorthand 형식)
export const parseTypographyValue = (token: TransformedToken) => {
  const originalValue = token.original.value;

  const fontFamily =
    PrimitiveJSON.primitive.fontFamily[
      getPrimitiveLastToken(originalValue.fontFamily) as keyof typeof PrimitiveJSON.primitive.fontFamily
    ]?.value;
  const fontWeight =
    PrimitiveJSON.primitive.fontWeight[
      getPrimitiveLastToken(originalValue.fontWeight) as keyof typeof PrimitiveJSON.primitive.fontWeight
    ]?.value;
  const fontSize =
    PrimitiveJSON.primitive.fontSize[
      getPrimitiveLastToken(originalValue.fontSize) as keyof typeof PrimitiveJSON.primitive.fontSize
    ]?.value;
  const lineHeight =
    PrimitiveJSON.primitive.lineHeight[
      getPrimitiveLastToken(originalValue.lineHeight) as keyof typeof PrimitiveJSON.primitive.lineHeight
    ]?.value;
  const letterSpacing =
    PrimitiveJSON.primitive.letterSpacing[
      getPrimitiveLastToken(originalValue.letterSpacing) as keyof typeof PrimitiveJSON.primitive.letterSpacing
    ]?.value;

  const typoObj = {
    fontFamily,
    lineHeight,
    fontWeight: fontWeight ? Number(fontWeight) : undefined,
    fontSize: fontSize ? `${fontSize}px` : undefined,
    letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
  };

  // undefined 값 제외 -> letterSpacing이 없는 경우가있음
  return Object.fromEntries(Object.entries(typoObj).filter(([, v]) => v !== undefined));
};

const getPrimitiveLastToken = (str: string) => {
  return str ? str.split('.').pop()?.replace('}', '') : undefined;
};
