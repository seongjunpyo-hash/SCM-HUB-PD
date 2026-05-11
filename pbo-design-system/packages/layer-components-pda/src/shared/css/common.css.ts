import { style } from '@vanilla-extract/css';

export const dimStyle = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#00000099',
  zIndex: 999,
});
