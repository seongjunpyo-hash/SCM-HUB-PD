import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const wrapStyle = style({
  color: tokens['fg-lower'],
  alignSelf: 'flex-end',
});

export const currentLengthStyle = style({
  color: tokens['fg-low'],
});
