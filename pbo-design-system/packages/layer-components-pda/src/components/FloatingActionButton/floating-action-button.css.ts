import { tokens, typography } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const floatingActionButtonStyle = style({
  padding: `${tokens.spacing[300]} ${tokens.spacing[400]}`,
  border: `1px solid ${tokens.stepper.border}`,
  borderRadius: 9999,
  backgroundColor: tokens.bg,
  color: tokens.fg,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing[200],

  ...typography.base['text-s-semibold'],

  ':active': {
    backgroundColor: tokens['bg-low'],
  },
  ':disabled': {
    backgroundColor: tokens['bg-disabled'],
    borderColor: tokens.stroke['border-disabled'],
    color: tokens['fg-disabled'],
    cursor: 'not-allowed',
  },
});
