import { tokens } from '@musinsa/layer-tokens/pda';
import { style } from '@vanilla-extract/css';

export const tabListStyles = style({
  padding: '0 20px',
  borderBottom: `1px solid ${tokens.stroke.border}`,

  display: 'flex',
});
