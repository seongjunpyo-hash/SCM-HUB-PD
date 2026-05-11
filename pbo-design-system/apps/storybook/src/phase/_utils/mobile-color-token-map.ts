import { colorTokenMap, tokens } from '@musinsa/phase-tokens/mobile';

export const mobilePrimitiveColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap).filter(([, value]) => !value.includes('var')),
);

export const mobileFunctionalColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const mobile = tokens.phaseMobile;
      const mobileKey = key.replace('phaseMobile-', '');

      return key in tokens || mobileKey in mobile;
    }),
);

export const mobileComponentColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const mobile = tokens.phaseMobile;
      const mobileKey = key.replace('phaseMobile-', '');

      return !(key in tokens) && !(mobileKey in mobile);
    }),
);
