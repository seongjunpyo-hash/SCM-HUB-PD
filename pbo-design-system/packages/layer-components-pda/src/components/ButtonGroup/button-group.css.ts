import { style, styleVariants } from '@vanilla-extract/css';

import type { ButtonGroupProps } from './button-group.types';

export const buttonGroupStyle = style({
  width: '100%',
  display: 'grid',
});

export const stretchModeStyles: Record<NonNullable<ButtonGroupProps['stretchMode']>, string> = styleVariants({
  both: {
    gridTemplateColumns: '1fr 1fr',
  },
  last: {
    gridTemplateColumns: '1fr 2fr',
  },
});
