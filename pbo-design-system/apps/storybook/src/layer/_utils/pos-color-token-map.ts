import { colorTokenMap, tokens } from '@musinsa/layer-tokens/pos';

export const posPrimitiveColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap).filter(([, value]) => !value.includes('var')),
);

export const posFunctionalColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const pos = tokens.pos;
      const posKey = key.replace('pos-', '');

      return key in tokens || posKey in pos;
    }),
);

export const posComponentColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const pos = tokens.pos;
      const posKey = key.replace('pos-', '');

      return !(key in tokens) && !(posKey in pos);
    }),
);
