import { tokens } from '@musinsa/layer-tokens/pda';
import { recipe } from '@vanilla-extract/recipes';

export const dividerStyles = recipe({
  base: {
    width: '100%',
  },

  variants: {
    type: {
      default: {
        height: 1,
        backgroundColor: tokens.stroke.divider,
      },
      section: {
        height: 8,
        backgroundColor: tokens.stroke['divider-low'],
      },
    },
  },
});
