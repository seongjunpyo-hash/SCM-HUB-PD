import { tokens } from '@musinsa/layer-tokens/desktop';
import { style, styleVariants } from '@vanilla-extract/css';

import { TEXTAREA_HEIGHT } from '../constants';

export const textareaBoxStyle = style({
  width: '100%',
  padding: tokens.spacing[300],
  borderRadius: tokens.rounded.xs,
  boxSizing: 'border-box',
  border: `1px solid ${tokens.textArea['border']}`,
  backgroundColor: tokens.textArea['bg'],

  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[200],

  selectors: {
    '&:hover': {
      borderColor: tokens.textArea['border-hover'],
    },
    '&:focus-within': {
      outline: 'none',
      borderColor: tokens.textArea['border-active'],
    },
    '&:has(textarea[aria-invalid="true"])': {
      borderColor: tokens.stroke['border-critical'],
    },
    // disabled
    '&:has(textarea[disabled])': {
      backgroundColor: tokens.textArea['bg-disabled'],
      borderColor: tokens.textArea['border-disabled'],
      color: tokens['fg-disabled'],
      cursor: 'not-allowed',
    },
    // readonly
    '&:has(textarea[readonly])': {
      backgroundColor: tokens.textArea['bg-disabled'],
      borderColor: tokens.textArea['border-disabled'],
      cursor: 'default',
    },
  },
});

export const heightModeStyles = styleVariants({
  min: {
    height: TEXTAREA_HEIGHT.MIN,
  },
  max: {
    height: TEXTAREA_HEIGHT.MAX,
  },
  auto: {
    minHeight: TEXTAREA_HEIGHT.MIN,
    maxHeight: TEXTAREA_HEIGHT.MAX,
    height: 'auto',
    overflowY: 'auto',
  },
});
