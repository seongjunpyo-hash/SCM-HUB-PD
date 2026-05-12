import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const switchInputStyle = style({
  all: 'unset',
  width: 32,
  height: 20,
  backgroundColor: tokens.switch.track,
  borderRadius: tokens.rounded.full,
  cursor: 'pointer',
  position: 'relative',

  selectors: {
    '&[data-state="checked"]': {
      backgroundColor: tokens.switch['track-checked'],
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.layerDesktop['border-accent']}`,
      outlineOffset: 1,
    },
    '&[data-disabled]': {
      cursor: 'not-allowed',
      backgroundColor: tokens.switch['track-disabled'],
    },
    '&[data-state="checked"][data-disabled]': {
      backgroundColor: tokens.switch['track-checkedDisabled'],
    },
  },
});

export const switchThumbStyle = style({
  display: 'block',
  width: 16,
  height: 16,
  borderRadius: tokens.rounded.full,
  backgroundColor: tokens.switch.thumb,
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',

  selectors: {
    '&[data-state="checked"]': {
      transform: 'translateX(14px)',
    },
    '&[data-disabled]': {
      backgroundColor: tokens.switch['thumb-disabled'],
    },
    '&[data-state="checked"][data-disabled]': {
      backgroundColor: tokens.switch['thumb-checkedDisabled'],
    },
  },
});
