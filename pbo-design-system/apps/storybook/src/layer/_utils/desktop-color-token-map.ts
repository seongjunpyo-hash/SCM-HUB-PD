import { colorTokenMap, tokens } from '@musinsa/layer-tokens/desktop';

export const desktopPrimitiveColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap).filter(([, value]) => !value.includes('var')),
);

export const desktopFunctionalColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const desktop = tokens.layerDesktop;
      const desktopKey = key.replace('layerDesktop-', '');

      return key in tokens || desktopKey in desktop;
    }),
);

export const desktopComponentColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const desktop = tokens.layerDesktop;
      const desktopKey = key.replace('layerDesktop-', '');

      return !(key in tokens) && !(desktopKey in desktop);
    }),
);
