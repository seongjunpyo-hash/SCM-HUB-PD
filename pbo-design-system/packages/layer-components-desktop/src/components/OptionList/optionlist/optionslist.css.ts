import { tokens } from '@musinsa/layer-tokens/desktop';
import { style } from '@vanilla-extract/css';

export const optionListStyle = style({
  borderRadius: tokens.rounded.xs,
  border: `1px solid ${tokens.optionList.border}`,
  backgroundColor: tokens.bg,
  boxShadow: '10px 10px 15px 8px #0000000D',
  overflowY: 'auto',
});
