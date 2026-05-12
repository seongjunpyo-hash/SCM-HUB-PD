import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['**/dist', '**/node_modules', '*.mdx'],
  },
  //  base
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
      'react': {
        version: 'detect',
      },
    },
  },

  // typescript
  tseslint.configs.recommended,

  // react
  pluginReact.configs.flat.recommended,
  eslintPluginReactHooks.configs['recommended-latest'],

  // jsx-a11y
  pluginJsxA11y.flatConfigs.recommended,

  // import
  {
    plugins: {
      import: pluginImport,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown', 'type'],
          'newlines-between': 'always',
          'pathGroups': [
            {
              pattern: 'react*',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@musinsa*',
              group: 'external',
              position: 'before',
            },
          ],
          'pathGroupsExcludedImportTypes': ['react', 'type'],
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',
    },
  },
  {
    rules: {
      // 'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error',
      'no-fallthrough': 'error',
      'no-console': 'error',
      'no-alert': 'error',
      'no-implicit-coercion': 'error',
      'no-unsafe-optional-chaining': 'error',
      'eqeqeq': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-inferrable-types': 'warn',
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['css'],
        },
      ],
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'error',
      'react/prop-types': 'error',
      'react/jsx-pascal-case': 'error',
      'react/self-closing-comp': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
