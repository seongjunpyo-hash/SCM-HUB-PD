import prettier from 'prettier';

export const prettierFormat = async (content: string) => {
  return await prettier.format(content, {
    parser: 'typescript',
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    arrowParens: 'always',
    quoteProps: 'preserve',
    trailingComma: 'all',
  });
};
