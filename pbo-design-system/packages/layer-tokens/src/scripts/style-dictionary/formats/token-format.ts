import { format as prettierFormat } from 'prettier';

import { colorsMapper } from '../utils/colors-mapper';
import { getTokenObject } from '../utils/get-token-object';
import { tokensMapper } from '../utils/tokens-mapper';
import { typographyMapper } from '../utils/typography-mapper';

import type { Format, TransformedToken } from 'style-dictionary/types';

const prettierOptions = {
  parser: 'typescript',
  printWidth: 120,
  singleQuote: true,
};

export const tokenFormat: Format = {
  name: 'layer-token-format',
  format: async ({ dictionary }) => {
    const { allTokens } = dictionary;

    // 토큰 타입 확인용
    // console.log([...new Set(allTokens.map((token) => token.type))]);

    const tokenList = allTokens.map(tokensMapper);
    const tokensJson = getTokenObject(tokenList);

    const colorTokens = allTokens.filter((token) => token.type === 'color');
    const colorTokenList = colorTokens.map(colorsMapper).filter(Boolean);
    const colorsJson = getTokenObject(colorTokenList as TransformedToken[]);

    const typographyTokens = allTokens.filter((token) => token.type === 'typography');
    const typographyTokenList = typographyTokens.map(typographyMapper).filter(Boolean);
    const typographyJson = getTokenObject(typographyTokenList as TransformedToken[]);

    const tokenCode = `
        export const tokens = ${JSON.stringify(tokensJson, null, 2)} as const;\n
        export const colors = ${JSON.stringify(colorsJson, null, 2)} as const;\n
        export const typography = ${JSON.stringify(typographyJson, null, 2)} as const;\n
    `;

    const formattedCode = await prettierFormat(tokenCode, prettierOptions);

    return `/**\n * ⚠️ 자동 생성된 파일입니다. 수정하지 마세요. ⚠️\n */\n${formattedCode}`;
  },
};
