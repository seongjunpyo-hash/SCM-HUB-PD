import { tokens } from '@musinsa/layer-tokens/pda';
import { style, styleVariants } from '@vanilla-extract/css';

import type { OptionSelectProps } from './option-select.types';

export const optionSelectStyle = style({
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: tokens.rounded.xs,
  outline: `1px solid ${tokens.pda.optionSelect.border}`,

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: tokens.spacing[400],
});

export const checkedStyle = style({
  outline: `2px solid ${tokens.pda['border-accent']}`,
});

export const disabledStyle = style({
  backgroundColor: tokens['bg-disabled'],
  outline: `1px solid ${tokens.stroke['border-disabled']}`,
  cursor: 'not-allowed',
});

export const sizeStyles: Record<NonNullable<OptionSelectProps['size']>, string> = styleVariants({
  large: {
    padding: `${tokens.spacing[600]} ${tokens.spacing[500]}`,
  },
  medium: {
    padding: `${tokens.spacing[400]} ${tokens.spacing[500]}`,
  },
});

export const leftWrapStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[50],
});

export const descriptionStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[100],
});
