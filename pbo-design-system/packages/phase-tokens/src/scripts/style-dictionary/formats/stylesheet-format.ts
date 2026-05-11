import { format as prettierFormat } from 'prettier';

import type { Format } from 'style-dictionary/types';

const prettierOptions = {
  parser: 'css',
  printWidth: 120,
  singleQuote: true,
};

export const stylesheetFormat: Format = {
  name: 'phase-stylesheet',
  format: async ({ dictionary }) => {
    // filter에서 type === color만 추출
    const { allTokens: colorTokens } = dictionary;

    const styleSheetCode = `
        :root {
            ${colorTokens
              .map((token) => {
                const name = token.path.join('-');

                const isPrimitive = token.name.includes('primitive');
                if (isPrimitive) {
                  return `--${name}: ${token.value};`;
                }

                const isReference = token.value !== token.original.value;
                if (!isReference) {
                  return `--${name}: ${token.original.value};`;
                }

                // 참조값인 경우 css 변수 처리
                const value = token.original.value.slice(1, -1).replace(/\./g, '-');
                return `--${name}: var(--${value});`;
              })
              .join('\n')}
        }
    `;

    const formattedCode = await prettierFormat(styleSheetCode, prettierOptions);

    return `/**\n * ⚠️ 자동 생성된 파일입니다. 수정하지 마세요. ⚠️\n */\n${formattedCode}`;
  },
};
