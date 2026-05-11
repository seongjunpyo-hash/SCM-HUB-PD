import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const tabListStyles = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
  },
  variants: {
    type: {
      tabLine: {
        borderBottom: `1px solid ${tokens.stroke.divider}`,
      },
      tabBox: {
        gap: 8,
      },
      tabText: {
        gap: 12,
      },
    },
    size: {
      large: {},
      medium: {},
    },
  },
  compoundVariants: [
    {
      variants: { type: 'tabLine', size: 'large' },
      style: { gap: 24 },
    },
    {
      variants: { type: 'tabLine', size: 'medium' },
      style: { gap: 20 },
    },
  ],
});

export const tabTextDividerStyle = style({
  width: 1,
  height: 12,
  backgroundColor: tokens.stroke.divider,
});
