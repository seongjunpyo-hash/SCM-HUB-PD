import { colorTokenMap, tokens } from '@musinsa/phase-tokens/desktop';

export const desktopPrimitiveColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap).filter(([, value]) => !value.includes('var')),
);

export const desktopFunctionalColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const desktop = tokens.phaseDesktop;
      const desktopKey = key.replace('phaseDesktop-', '');

      return key in tokens || desktopKey in desktop;
    }),
);

export const desktopComponentColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const desktop = tokens.phaseDesktop;
      const desktopKey = key.replace('phaseDesktop-', '');

      return !(key in tokens) && !(desktopKey in desktop);
    }),
);
