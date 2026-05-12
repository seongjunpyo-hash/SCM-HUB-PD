import StyleDictionary from 'style-dictionary';
import { transformGroups } from 'style-dictionary/enums';

import { stylesheetFormat } from './formats/stylesheet-format';
import { tokenFormat } from './formats/token-format';

import type { Config } from 'style-dictionary/types';

StyleDictionary.registerFormat(stylesheetFormat);
StyleDictionary.registerFormat(tokenFormat);

const desktopConfig: Config = {
  source: [
    '../_shared/tokens/Assets.json',
    '../_shared/tokens/Core/*.json',
    '../_shared/tokens/Core/**/*.json',
    '../_shared/tokens/LayerDesktop/Functional.json',
    '../_shared/tokens/LayerDesktop/Component/Black.json',
    '../_shared/tokens/LayerDesktop/Component/Default.json',
  ],
  platforms: {
    lightColors: {
      buildPath: 'src/output/stylesheet/',
      transformGroup: transformGroups.css,
      files: [
        {
          destination: 'layer-desktop-light-colors.css',
          format: stylesheetFormat.name,
          filter: (token) => token.type === 'color',
        },
      ],
    },
    /** token (실제 figma token과 1:1 매칭) */
    token: {
      buildPath: 'src/output/desktop',
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

/**
 *  dark theme은 desktopConfig 기준으로 Dark.json을 오버라이딩함
 *  (Dark.json에 없는 토큰은 Default.json을 fallback 개념)
 */
const desktopDarkConfig: Config = {
  source: [
    '../_shared/tokens/Assets.json',
    '../_shared/tokens/Core/*.json',
    '../_shared/tokens/Core/**/*.json',
    '../_shared/tokens/LayerDesktop/Functional.json',
    '../_shared/tokens/LayerDesktop/Component/Default.json',
    '../_shared/tokens/LayerDesktop/Component/Black.json',
  ],
  platforms: {
    darkColors: {
      buildPath: 'src/output/stylesheet/',
      transformGroup: transformGroups.css,
      files: [
        {
          destination: 'layer-desktop-dark-colors.css',
          format: stylesheetFormat.name,
          filter: (token) => token.type === 'color',
        },
      ],
    },
  },
};

export const desktopStyleDictionary = new StyleDictionary(desktopConfig);
export const desktopDarkStyleDictionary = new StyleDictionary(desktopDarkConfig);
