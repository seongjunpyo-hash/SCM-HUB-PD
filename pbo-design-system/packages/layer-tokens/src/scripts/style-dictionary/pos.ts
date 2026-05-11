import StyleDictionary from 'style-dictionary';
import { transformGroups } from 'style-dictionary/enums';

import { stylesheetFormat } from './formats/stylesheet-format';
import { tokenFormat } from './formats/token-format';

import type { Config } from 'style-dictionary/types';

StyleDictionary.registerFormat(stylesheetFormat);
StyleDictionary.registerFormat(tokenFormat);

const posConfig: Config = {
  source: [
    '../_shared/tokens/Assets.json',
    '../_shared/tokens/Core/*.json',
    '../_shared/tokens/Core/**/*.json',
    '../_shared/tokens/LayerPOS/*.json',
  ],
  platforms: {
    /** ligth theme color sheet */
    lightColors: {
      buildPath: 'src/output/stylesheet/',
      transformGroup: transformGroups.css,
      files: [
        {
          destination: 'layer-pos-light-colors.css',
          format: stylesheetFormat.name,
          filter: (token) => token.type === 'color',
        },
      ],
    },
    /** dark theme color sheet => 추후 dark theme 추가시 해당 filter 처리 추가해야함 (TBD) */
    darkColors: {
      buildPath: 'src/output/stylesheet/',
      transformGroup: transformGroups.css,
      files: [
        {
          destination: 'layer-pos-dark-colors.css',
          format: stylesheetFormat.name,
          filter: (token) => token.type === 'color',
        },
      ],
    },
    /** token (실제 figma token과 1:1 매칭) */
    token: {
      buildPath: 'src/output/pos',
      transformGroup: transformGroups.css,
      files: [
        {
          destination: 'token.ts',
          format: tokenFormat.name,
        },
      ],
    },
  },
};

export const posStyleDictionary = new StyleDictionary(posConfig);
