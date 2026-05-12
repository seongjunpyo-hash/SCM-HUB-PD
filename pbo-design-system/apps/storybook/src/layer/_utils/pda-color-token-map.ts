import { colorTokenMap, tokens } from '@musinsa/layer-tokens/pda';

export const pdaPrimitiveColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap).filter(([, value]) => !value.includes('var')),
);

export const pdaFunctionalColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const pda = tokens.pda;
      const pdaKey = key.replace('pda-', '');

      return key in tokens || pdaKey in pda;
    }),
);

export const pdaComponentColorTokenMap = Object.fromEntries(
  Object.entries(colorTokenMap)
    .filter(([, value]) => value.includes('var'))
    .filter(([key]) => {
      const pda = tokens.pda;
      const pdaKey = key.replace('pda-', '');

      return !(key in tokens) && !(pdaKey in pda);
    }),
);
